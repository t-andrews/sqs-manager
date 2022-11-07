<script lang="ts">
    import Card from '@smui/card';
    import Button from '@smui/button';
    import Keydown from 'svelte-keydown';
    import { goto } from '$app/navigation';
    import Textfield from '@smui/textfield';
    import Paper, { Title, Content } from '@smui/paper';
    import { SyncLoader } from 'svelte-loading-spinners';
    import { accountInfo } from '../../lib/shared/stores/AccountInfo';
    import { clientFetch } from '../../lib/shared/client/clientFetch';

    let endpoint = '';
    let accessKeyId = '';
    let secretAccessKey = '';

    let connecting = false;

    async function connectSqs() {
        connecting = true;
        accountInfo.update(a => a = { endpoint, accessKeyId, secretAccessKey });
        await clientFetch('/api/connect', $accountInfo, { method: 'POST', body: JSON.stringify({ endpoint, accessKeyId, secretAccessKey }) })
        await goto('/queues', { replaceState: true });
    }
</script>

<style>
    .connect-card {
        width: 50%;
        margin-top: 3%;
        margin-left: 25%;
    }
    .connect-btn {
        margin-top: 5%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<Keydown on:Enter={
        async () => {
            if (!endpoint || !accessKeyId || !secretAccessKey) {
                return;
            }
            await connectSqs();
        }
    }
/>

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
