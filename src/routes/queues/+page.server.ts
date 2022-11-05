import type { Pages } from '../../lib/shared/infrastructure/SqsService';

/** @type {import('./$types').PageServerLoad} */
export async function load(): Promise<Pages> {
    const resp = await fetch('http://localhost:5173/api/queues');
    return await resp.json() as Pages;
}
