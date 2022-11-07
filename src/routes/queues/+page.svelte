<script>
    import Card from '@smui/card';
    import Button from '@smui/button';
    import Keydown from 'svelte-keydown';
    import { invalidate } from "$app/navigation";
    import Textfield from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text';
    import { SyncLoader } from 'svelte-loading-spinners';
    import { clientFetch } from "$lib/shared/client/clientFetch";
    import { accountInfo } from "$lib/shared/stores/AccountInfo";
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import List, { Item, PrimaryText, SecondaryText, Text } from '@smui/list';

    async function getAllQueues() {
        const resp = await clientFetch('/api/queues', $accountInfo);
        return resp.json();
    }

    let createQueueDialogOpen = false;
    let creatingQueue = false;
    let createQueueNameInvalid = false;

    const createQueueInput = {
        name: ''
    };

    async function checkQueueNameUnique(evt) {
        const { queues } = await(data);
        createQueueNameInvalid = queues.some(q => q.attributes.QueueName === evt.target.value);
    }

    async function createQueue() {
        creatingQueue = true;
        try {
            await clientFetch('/api/queues', $accountInfo, { method: 'POST', body: JSON.stringify(createQueueInput) });
        } catch (err) {
            console.error(err.message);
        }
        creatingQueue = false;
        window.location = '/queues';
    }

    let data = getAllQueues();
</script>

<style>
    .queue-list-card {
        margin-top: 10px;
        width: 100%;
    }
</style>

<Dialog
        bind:open={createQueueDialogOpen}
        aria-labelledby="create-queue-dialog-title"
        aria-describedby="create-queue-dialog-content"
>
    <Title id="create-queue-dialog-title">Create a new Queue</Title>
    <Content id="create-queue-dialog-content">
        <Textfield bind:value={createQueueInput.name} invalid={createQueueNameInvalid} on:keyup={checkQueueNameUnique} label="Queue name">
            <HelperText validationMsg slot="helper">
                Queue already exists
            </HelperText>
        </Textfield>
    </Content>
    <Actions>
        <div class="create-queue-btn">
            {#if creatingQueue}
                <SyncLoader size="30" color="#FF3E00" unit="px" duration="1s" />
            {:else}
                <Button disabled={createQueueNameInvalid || !createQueueInput.name} on:click={createQueue}>Create</Button>
            {/if}
        </div>
    </Actions>
</Dialog>

<Keydown on:Enter={
        async () => {
            if (!createQueueDialogOpen || !createQueueInput.name) {
                return;
            }
            await createQueue();
        }
    }
/>
<Button variant="raised" color="secondary" style="margin-top: 8px; left: 100%; transform:translate(-100%, 0);" on:click={() => (createQueueDialogOpen = true)}>Create</Button>

<div class="card-container queue-list-card">
    <Card padded variant="primary">
        {#await data}
            <SyncLoader size="30" color="#FF3E00" unit="px" duration="1s" />
        {:then { queues }}
            <List twoLine nonInteractive>
                {#each queues as queue}
                    <Item>
                        <Text>
                            <PrimaryText><a style="font-size: 1.3em" href={`/queue/${queue.attributes.QueueName}`}>{queue.attributes.QueueName}</a></PrimaryText>
                            <SecondaryText>~{queue.attributes.ApproximateNumberOfMessages} messages</SecondaryText>
                        </Text>
                    </Item>
                {/each}
            </List>
        {/await}
    </Card>
</div>
