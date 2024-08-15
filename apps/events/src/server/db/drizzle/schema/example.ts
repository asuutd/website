import { createId } from '@paralleldrive/cuid2';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const example = pgTable('Example', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey()
});
