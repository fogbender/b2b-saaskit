// @ts-check
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import config from '../../drizzle.config.json' assert { type: 'json' };
import { db } from './db';

const migrationsFolder = config.out;
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
