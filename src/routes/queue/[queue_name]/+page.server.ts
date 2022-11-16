/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
    const resp = await fetch('/api/queues');
    const { queues } = await resp.json();
    return queues.find(q => q.attributes.QueueName === params.queue_name);
}
