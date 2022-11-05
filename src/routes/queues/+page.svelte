<script>
    import List, { Item } from '@smui/list';
    import Button from '@smui/button';

    /** @type {import('src/lib/shared/infrastructure/SqsService').Pages} */
    export let data;

    let rows = [];
    let page = 0;
    let itemsPerPage = 10;
    let loading = true;


    const setPage = (p) => {
        if (p >= 0 && p < data.pages.length) {
            page = p;
        }
    }
</script>

<nav class="pagination">
    <ul>
        <li>
            <Button
                    on:click={() => setPage(page - 1)}
            >
                PREV
            </Button>
        </li>

        {#each data.pages as page, i}
            <li>
                <Button
                        on:click={() => setPage(i)}
                >
                    {i + 1}
                </Button>
            </li>
        {/each}

        <li>
            <Button
                    type="button"
                    class="btn-next-prev"
                    on:click={() => setPage(page + 1)}
            >
                NEXT
            </Button>
        </li>
    </ul>
</nav>

<List
        twoLine
>
    {#each data.pages[page].queues as queue}
        <Item>
            <p>Name: {queue.attributes.QueueName}</p>
        </Item>
    {/each}
</List>
