import { SqsService } from '../../../lib/shared/infrastructure/SqsService';
import { retrieveAccountInfoFromUrl } from '../../../lib/shared/client/retrieveAccountInfoFromUrl';

async function getServiceInstance(url: string): Promise<SqsService> {
    const info = retrieveAccountInfoFromUrl(url);
    return SqsService.getInstance() ?? await SqsService.connect(info.endpoint, info.accessKeyId, info.secretAccessKey);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function GET({ request }): Promise<Response> {
    const queues = await (await getServiceInstance(request.url)).getAllQueues();
    return new Response(JSON.stringify(queues));
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function POST({ request }): Promise<Response> {
    const req = await request.json();
    const newQueue = await SqsService.getInstance().createQueue(req.name);
    return new Response(JSON.stringify(newQueue));
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function DELETE({ request }): Promise<Response> {
    const req = await request.json();
    await SqsService.getInstance().deleteQueue(req.queueUrl);
    return new Response();
}
