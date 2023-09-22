import { createId } from '@paralleldrive/cuid2';
import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const example = mysqlTable('Example', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey()
});
