<script>
    import Button from '@smui/button';
    import { SyncLoader } from 'svelte-loading-spinners';
    import { clientFetch } from "$lib/shared/client/clientFetch";
    import { accountInfo } from "$lib/shared/stores/AccountInfo";
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import { Item, PrimaryText, SecondaryText, Text } from '@smui/list';

    export let queue;
    let deletingQueue = false;
    let deleteQueueDialogOpen = false;

    async function deleteQueue() {
        deletingQueue = true;
        await clientFetch('/api/queues', $accountInfo, { method: 'DELETE', body: JSON.stringify({ queueUrl: queue.queueUrl }) });
        window.location = '/queues';
    }

</script>

<Dialog
        bind:open={deleteQueueDialogOpen}
        aria-labelledby="delete-queue-dialog-title"
        aria-describedby="delete-queue-dialog-content"
>
    <Title id="delete-queue-dialog-title">Deleting a Queue</Title>
    <Content id="delete-queue-dialog-content">
        Are you sure you want to delete the queue {queue.attributes.QueueName}?
    </Content>
    <Actions>
        <Button on:click={() => deleteQueueDialogOpen = false}>No</Button>
        {#if deletingQueue}
            <SyncLoader size="30" color="#FF3E00" unit="px" duration="1s" />
        {:else}
            <Button on:click={deleteQueue}>Yes</Button>
        {/if}
    </Actions>
</Dialog>

<Item style="padding: 15px">
    <Text style="width: 70%">
        <PrimaryText><a style="font-size: 1.3em;" href={`/queue/${queue.attributes.QueueName}`}>{queue.attributes.QueueName}</a></PrimaryText>
        <SecondaryText style="top: 20px">~{queue.attributes.ApproximateNumberOfMessages} messages</SecondaryText>
    </Text>
    <Actions style="width: 30%">
        <Button variant="raised" color="secondary" style="right: 0" on:click={() => deleteQueueDialogOpen = true}>Delete</Button>
    </Actions>
</Item>
