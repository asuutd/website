import schema from '.';

export type Event = typeof schema.event.$inferSelect;
export type Tier = typeof schema.tier.$inferSelect;
export type Ticket = typeof schema.ticket.$inferSelect;
export type InsertCode = typeof schema.code.$inferInsert;
