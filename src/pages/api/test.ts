import type { APIRoute } from 'astro';
import { Pool } from '@neondatabase/serverless';

export const get: APIRoute = async () => {
	const DATABASE_URL =
		'postgres://j:pmjG2ifonxA0@ep-soft-smoke-590797.us-east-2.aws.neon.tech/neondb?options=project%3Dep-soft-smoke-590797';
	// postgres://<user>:<password>@my-endpoint-123456.us-east-2.aws.neon.tech/main?options=project%3Dmy-endpoint-123456
	//

	const pool = new Pool({
		connectionString: DATABASE_URL,
	});
	const {
		rows: [{ now }],
	} = await pool.query('SELECT now()');

	console.log(123, now);

	return new Response('Hello World!', { status: 200 });
};
