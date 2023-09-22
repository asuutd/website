import { TRPCClientError } from '@trpc/client';
import { authedProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { InferSelectModel, and, eq, gte, lte, sql } from 'drizzle-orm';
import { event as eventSchema } from '../../db/drizzle/schema/event';
import { user } from '@/server/db/drizzle/schema/user';
import { tier } from '@/server/db/drizzle/schema/tier';
import { date } from 'drizzle-orm/mysql-core';
import { ticket } from '@/server/db/drizzle/schema/ticket';
import { eventLocation } from '@/server/db/drizzle/schema/eventlocation';
import { organizer } from '@/server/db/drizzle/schema/organizer';

type Event = typeof eventSchema.$inferSelect;
type Tier = typeof tier.$inferSelect;
type EventLocation = typeof eventLocation.$inferInsert;

export const eventRouter = t.router({
	getEvent: t.procedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const dbEvent = await ctx.drizzle
				.select({
					Event: eventSchema,
					Tier: tier,
					ticketNumber: sql<number>`count(${ticket.id})`.mapWith(Number),
					location: eventLocation,

					user: {
						name: user.name,
						image: user.image
					}
				})
				.from(eventSchema)
				.where(eq(eventSchema.id, input.eventId))
				.leftJoin(
					tier,
					and(
						eq(eventSchema.id, tier.eventId)
						/* lte(eventSchema.start, new Date()),
						gte(eventSchema.end, new Date()) */
					)
				)
				.leftJoin(ticket, eq(tier.id, ticket.tierId))
				.leftJoin(eventLocation, eq(eventSchema.id, eventLocation.id))
				.leftJoin(organizer, eq(eventSchema.organizerId, organizer.id))
				.leftJoin(user, eq(organizer.id, user.id))
				.groupBy(sql`${tier.id}`);
			const result = dbEvent.reduce<
				Record<
					string,
					{
						event: Event & {
							tiers: (Tier & {
								_count: {
									Ticket: number;
								};
							})[];
							location: EventLocation | null;
							organizer: {
								user: {
									image: string | null;
									name: string | null;
								};
							} | null;
						};
					}
				>
			>((acc, row) => {
				const event = row.Event;
				acc[0]?.event;
				const tier = row.Tier;
				const ticketNumber = row.ticketNumber;

				if (!acc[event.id]) {
					acc[event.id] = {
						event: {
							...event,
							tiers: [],
							location: null,
							organizer: null
						}
					};
				}

				if (tier) {
					acc[event.id]?.event.tiers.push({
						...tier,
						_count: {
							Ticket: ticketNumber
						}
					});
				}

				if (row.location) {
					const currentEvent = acc[event.id];
					if (currentEvent) {
						currentEvent.event.location = row.location;
					}
				}

				if (row.user) {
					const currentEvent = acc[event.id];
					if (currentEvent) {
						currentEvent.event.organizer = {
							user: {
								image: row.user.image,
								name: row.user.name
							}
						};
					}
				}

				return acc;
			}, {});
			const arr = Object.values(result);
			console.log(arr[0]);
			/* const event = await ctx.prisma.event.findFirst({
				where: {
					id: input.eventId
				},
				include: {
					Tier: {
						where: {
							AND: [
								{
									start: {
										lte: new Date()
									}
								},
								{
									end: {
										gte: new Date()
									}
								}
							]
						},
						include: {
							_count: {
								select: {
									Ticket: true
								}
							}
						}
					},
					location: true,
					organizer: {
						select: {
							user: {
								select: {
									name: true,
									image: true
								}
							}
						}
					}
				}
			}); */

			return arr[0]?.event;
		}),
	getEvents: t.procedure.query(async ({ ctx }) => {
		return await ctx.drizzle.query.event.findMany({
			where: gte(eventSchema.start, new Date())
		});
	}),
	createEvent: authedProcedure
		.input(
			z.object({
				name: z.string(),
				startTime: z.date(),
				endTime: z.date(),
				bannerImage: z.string().url(),
				ticketImage: z.string().url(),
				location: z
					.object({
						address: z.string().optional(),
						coordinates: z
							.array(z.number())
							.optional()
							.refine((data) => !data || data.length === 2, 'Location must have only two numbers')
					})
					.optional()
			})
		)
		.mutation(({ input, ctx }) => {
			if (ctx.session.user.role === 'ORGANIZER') {
				const newEvent = ctx.prisma.event.create({
					data: {
						name: input.name,
						start: input.startTime,
						end: input.endTime,
						image: input.bannerImage,
						ticketImage: input.ticketImage,
						organizerId: ctx.session.user.id,
						//RE-READ
						...(input.location?.coordinates &&
						input.location?.coordinates[0] &&
						input.location?.coordinates[1]
							? {
									location: {
										create: {
											long: input.location.coordinates[0],
											lat: input.location.coordinates[1],
											name: input.location.address
										}
									}
							  }
							: {}),
						EventAdmin: {
							create: {
								userId: ctx.session.user.id
							}
						}
					}
				});
				return newEvent;
			} else {
				throw new TRPCError({
					code: 'UNAUTHORIZED'
				});
			}
		})
});
