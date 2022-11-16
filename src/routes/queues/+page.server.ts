/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const resp = await fetch('/api/queues');
    return resp.json();
}
