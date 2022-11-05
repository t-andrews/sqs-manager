<script lang="ts">
    import Card from '@smui/card';
    import Textfield from '@smui/textfield';
    import Button from '@smui/button';
    import { SqsService } from '../../lib/shared/infrastructure/SqsService';
    import { SyncLoader } from 'svelte-loading-spinners';
    import { goto } from '$app/navigation';
    import Paper, { Title, Content } from '@smui/paper';
    import { accountInfo } from '../../lib/shared/stores/AccountInfo';

    let endpoint = '';
    let accessKeyId = '';
    let secretAccessKey = '';

    let connecting = false;

    async function connectSqs() {
        connecting = true;
        await fetch('/api/connect', { method: 'POST', body: JSON.stringify({ endpoint, accessKeyId, secretAccessKey }) })
        await goto('/queues', { replaceState: true });
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
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<div class="card-container connect-card">
    <Card padded variant="outlined" class="paper-container">
        <Paper color="primary">
            <Title>Connection</Title>
            <Content>
                Enter access information to connect to the SQS service
            </Content>
        </Paper>
        <Textfield bind:value={endpoint} label="Endpoint"/>
        <Textfield bind:value={accessKeyId} label="Access Key ID"/>
        <Textfield bind:value={secretAccessKey} label="Secret Access Key"/>
        <div class="connect-btn">
            {#if connecting}
                <SyncLoader size="30" color="#FF3E00" unit="px" duration="1s" />
            {:else}
                <Button on:click={connectSqs} disabled={!endpoint || !accessKeyId || !secretAccessKey}>Connect</Button>
            {/if}
        </div>
    </Card>
</div>
