import { SqsService } from '../../../lib/shared/infrastructure/SqsService';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function POST( { request }): Promise<Response> {
    const res = await request.json();
    await SqsService.connect(res.endpoint, res.accessKeyId, res.secretAccessKey);
    return new Response();
}
