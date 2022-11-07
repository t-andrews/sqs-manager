export interface QueueAttributes {
    ApproximateNumberOfMessages: number;
    ApproximateNumberOfMessagesDelayed: number;
    ApproximateNumberOfMessagesNotVisible: number;
    CreatedTimestamp: number;
    DelaySeconds: number;
    LastModifiedTimestamp: number;
    MaximumMessageSize: number;
    MessageRetentionPeriod: number;
    QueueName: string;
    QueueArn: string;
    ReceiveMessageWaitTimeSeconds: number;
    VisibilityTimeout: number;
}

export class QueueSummary {
    private constructor(
        public readonly queueUrl: string,
        public readonly attributes: QueueAttributes
    ) {}

    public static create(queueUrl: string, attributes: QueueAttributes) {
        return new QueueSummary(queueUrl, attributes);
    }
}
