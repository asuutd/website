import schema from '.';

export type Event = typeof schema.event.$inferSelect;
export type Tier = typeof schema.tier.$inferSelect;
