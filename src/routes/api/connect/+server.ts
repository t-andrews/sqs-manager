import { SqsService } from '../../../lib/shared/infrastructure/SqsService';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function POST( { request }): Promise<Response> {
    const req = await request.json();
    await SqsService.connect(req.endpoint, req.accessKeyId, req.secretAccessKey);
    return new Response();
}
