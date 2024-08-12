// funny story: if you put this file to src/db/migrate.ts it will be running during
// `drizzle-kit generate` but moving it to src/db/scripts seems to fix the issue
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { dbFolder as migrationsFolder } from '../../../drizzle.config';
import { db } from '../db';

console.log('Migrating database using', migrationsFolder, 'folder');

// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder })
	.then(() => {
		console.log('Migrations complete!');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Migrations failed!', err);
		process.exit(1);
	});
