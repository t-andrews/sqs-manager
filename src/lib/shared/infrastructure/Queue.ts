import type { SQS } from 'aws-sdk';

export interface QueueAttributes {
    CreatedTimestamp: string;
    DelaySeconds: number;
    LastModifiedTimestamp: number;
    MaximumMessageSize: number;
    MessageRetentionPeriod: number;
    QueueName: string;
    QueueArn: string;
    ReceiveMessageWaitTimeSeconds: number;
    VisibilityTimeout: number;
}

export class Queue {
    private constructor(
        public readonly queueUrl: string,
        public readonly attributes: QueueAttributes
    ) {}

    public static create(queueUrl: string, attributes: QueueAttributes) {
        return new Queue(queueUrl, attributes);
    }
}
