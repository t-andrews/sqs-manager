import AWS from 'aws-sdk';
import clc from 'cli-color';
import { ArgumentParser } from 'argparse';


const parser = new ArgumentParser();
parser.add_argument('-n', '--name', {
    type: 'str',
    required: true,
    help: 'Port to run on (default: 8001)',
})
const args = parser.parse_args();

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'test123',
    secretAccessKey: 'test123'
});
const client = new AWS.SQS({ endpoint: 'http://localhost:4566' });
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
await client.createQueue({ QueueName: args.name }).promise();
console.log(clc.green(`Queue ${args.name} created`));
