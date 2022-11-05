import { SqsService } from '../../../lib/shared/infrastructure/SqsService';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function GET(): Promise<Response> {
    const queues = await SqsService.getInstance().getAllQueues();
    return new Response(JSON.stringify(queues));
}
