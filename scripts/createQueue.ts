import AWS from 'aws-sdk';

if (!process.env.QUEUE_NAME) {
    throw new Error('QUEUE_NAME env var is missing')
}

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'test123',
    secretAccessKey: 'test123'
});
const client = new AWS.SQS({ endpoint: 'http://localhost:4566' });
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
await client.createQueue({ QueueName: process.env.QUEUE_NAME }).promise();

