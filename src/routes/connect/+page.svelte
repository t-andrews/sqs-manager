<script lang="ts">
    import Card, { Actions } from '@smui/card';
    import Textfield from '@smui/textfield';
    import Button from '@smui/button';
    import { SqsService } from '../../lib/shared/infrastructure/SqsService';

    let endpoint = '';
    let accessKeyId = '';
    let secretAccessKey = '';

    async function connectSqs() {
        await SqsService.connect(endpoint, accessKeyId, secretAccessKey);
    }
</script>

<style>
    .connect-card {
        width: 30%;
        margin-top: 3%;
        margin-left: 35%;
    }
    .connect-btn {
        margin-top: 5%;
        width: 100%;
        text-align: center;
    }
</style>

<div class="card-container connect-card">
    <Card padded>
        <h3>Connect to SQS</h3>
        <Textfield bind:value={endpoint} label="Endpoint"/>
        <Textfield bind:value={accessKeyId} label="Access Key ID"/>
        <Textfield bind:value={secretAccessKey} label="Secret Access Key"/>
        <div class="connect-btn">
            <Button on:click={connectSqs} disabled={!endpoint || !accessKeyId || !secretAccessKey}>Connect</Button>
        </div>
    </Card>
</div>
