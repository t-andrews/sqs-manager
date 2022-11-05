import AWS from 'aws-sdk';
import { Queue, type QueueAttributes } from './Queue';
import { accountInfo } from '../stores/AccountInfo';
import { get } from 'svelte/store';

export interface Page {
    queues: Queue[]
}

export interface Pages {
    pages: Page[];
}

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

        return this.instance;
    }

    public async getAllQueues(): Promise<{ pages: Page[] }> {
        const pages: Page[] = [{ queues: [] }];
        let response = await this.client.listQueues().promise();
        if (response.QueueUrls) {
            pages[0].queues.push(...(await this.createQueues(response.QueueUrls)))
        }
        while (response.NextToken) {
            response = await this.client.listQueues({ NextToken: response.NextToken }).promise()
            if (response.QueueUrls) {
                pages.push({ queues: await this.createQueues(response.QueueUrls) })
            }
        }
        return { pages };
    }

    public async createQueue(queueName: string): Promise<void> {
        await this.client.createQueue({ QueueName: queueName }).promise();
    }

    private async createQueues(urls: string[]): Promise<Queue[]> {
        return Promise.all(urls.map(async url => {
            const attr = await this.getQueueAttributes(url);
            return Queue.create(url, attr)
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
            CreatedTimestamp: '',
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
