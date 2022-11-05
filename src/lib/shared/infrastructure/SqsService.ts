import AWS from 'aws-sdk';
import { accountInfo } from '../stores/AccountInfo';

export class SqsService {
    private readonly client: AWS.SQS;
    private static instance: SqsService;

    private constructor(endpoint: string) {
        this.client = new AWS.SQS({ endpoint })
    }

    public static async connect(endpoint: string, accessKeyId: string, secretAccessKey: string): Promise<SqsService> {
        accountInfo.set({
            endpoint,
            accessKeyId,
            secretAccessKey
        });
        AWS.config.update({
            region: 'us-east-1',
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        });
        if (!this.instance) {
            this.instance = new SqsService(endpoint);
        }

        const queueUrls = await this.instance.getAllQueues();
        console.log({queueUrls});

        return this.instance;
    }

    public async getAllQueues(): Promise<string[]|undefined> {
        const { QueueUrls } = await this.client.listQueues().promise();
        return QueueUrls;
    }
}
