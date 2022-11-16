<script>
    import Card from '@smui/card';
    import Paper from '@smui/paper';
    import { Content } from '@smui/card';

    export let data;
</script>

<Paper style="padding: 1px 0 1px 10px" color="primary">
    <h2><a href="/queues" style="color: white;">Queues</a> / {data.attributes.QueueName}</h2>
</Paper>

<Card style="margin-top: 10px">
    <Content>
        Arn: {data.attributes.QueueArn}
    </Content>
</Card>
