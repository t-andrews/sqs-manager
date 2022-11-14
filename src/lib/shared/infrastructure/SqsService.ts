import AWS from 'aws-sdk';
import { QueueSummary, type QueueAttributes } from './QueueSummary';

export class SqsService {
    private readonly client: AWS.SQS;
    private static instance: SqsService;

    private constructor(endpoint: string) {
        this.client = new AWS.SQS({ endpoint })
    }

    public static getInstance() {
        return this.instance;
    }

    public static async connect(endpoint: string, accessKeyId: string, secretAccessKey: string): Promise<SqsService> {
        AWS.config.update({
            region: 'us-east-1',
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        });
        if (!this.instance) {
            this.instance = new SqsService(endpoint);
        }

        return this.instance;
    }

    public async getAllQueues(): Promise<{ queues: QueueSummary[] }> {
        const queues: { queues: QueueSummary[] } = {
            queues: []
        };
        let response = await this.client.listQueues().promise();
        if (response.QueueUrls) {
            queues.queues.push(...(await this.createQueueSummaries(response.QueueUrls)));
        }
        while (response.NextToken) {
            response = await this.client.listQueues({ NextToken: response.NextToken }).promise();
            if (response.QueueUrls) {
                queues.queues.push(...(await this.createQueueSummaries(response.QueueUrls)));
            }
        }
        return queues;
    }

    public async createQueue(queueName: string): Promise<QueueSummary> {
        const resp = await this.client.createQueue({ QueueName: queueName }).promise();
        const queueUrl = resp.QueueUrl as string;
        const attr = await this.getQueueAttributes(queueUrl);
        return QueueSummary.create(queueUrl, attr)
    }

    public async deleteQueue(queueUrl: string): Promise<void> {
        await this.client.deleteQueue({ QueueUrl: queueUrl }).promise();
    }

    private async createQueueSummaries(urls: string[]): Promise<QueueSummary[]> {
        return Promise.all(urls.map(async url => {
            const attr = await this.getQueueAttributes(url);
            return QueueSummary.create(url, attr)
        }));
    }

    private async getQueueAttributes(queueUrl: string): Promise<QueueAttributes> {
        const allAttributes = (await this.client.getQueueAttributes({
            QueueUrl: queueUrl,
            AttributeNames: ["All"]
        }).promise()).Attributes;
        if (!allAttributes) {
            throw new Error('Attempt to retrieve queue attributes failed.')
        }

        const arnSections = allAttributes.QueueArn.split(':');
        const queueName = arnSections[arnSections.length -1];
        return {
            ApproximateNumberOfMessages: Number(allAttributes.ApproximateNumberOfMessages),
            ApproximateNumberOfMessagesDelayed: Number(allAttributes.ApproximateNumberOfMessagesDelayed),
            ApproximateNumberOfMessagesNotVisible: Number(allAttributes.ApproximateNumberOfMessagesNotVisible),
            CreatedTimestamp: Number(allAttributes.CreatedTimestamp),
            DelaySeconds: Number(allAttributes.DelaySeconds),
            LastModifiedTimestamp: Number(allAttributes.LastModifiedTimestamp),
            MaximumMessageSize: Number(allAttributes.MaximumMessageSize),
            MessageRetentionPeriod: Number(allAttributes.MessageRetentionPeriod),
            QueueArn: allAttributes.QueueArn,
            QueueName: queueName,
            ReceiveMessageWaitTimeSeconds: Number(allAttributes.MaximumMessageSize),
            VisibilityTimeout: Number(allAttributes.VisibilityTimeout)
        };
    }
}
