import * as path from 'path';
import { promises as fs } from 'fs';
import { Migrator, FileMigrationProvider } from 'kysely';
import { db } from '../lib/kysely';

const tableExists = async (tableName: string) => {
	const tables = await db
		.selectFrom('pg_tables')
		.select('tablename')
		.where('schemaname', '=', 'public')
		.where('tablename', '=', tableName)
		.execute();
	return tables.length > 0;
};

export async function migrateToLatest() {
	await db.schema.dropTable('funny_images').execute();
	if (await tableExists('funny_images')) {
		return;
	}

	await db.schema
		.createTable('funny_images')
		.addColumn('id', 'serial', (cb) => cb.primaryKey())
		.addColumn('url', 'varchar(255)', (cb) => cb.notNull())
		.addColumn('description', 'varchar(255)', (cb) => cb.notNull())
		.execute();
	console.log(`Created "funny_images" table`);

	return true;
}

export async function migrateToLatestDoesntWork() {
	// proudly brought to you by: [VercelPostgresError]: VercelPostgresError - 'kysely_transactions_not_supported': Transactions are not supported yet.
	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: 'some/path/to/migrations',
		}),
	});
	const { error, results } = await migrator.migrateToLatest();
	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === 'Error') {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});
	if (error) {
		console.error('failed to migrate');
		console.error(error);
		process.exit(1);
	}
	await db.destroy();
}
