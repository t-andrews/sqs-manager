<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import IconButton, { Icon } from '@smui/icon-button';
    import { isDark } from '../lib/shared/stores/Theme';
    import { accountInfo } from '../lib/shared/stores/AccountInfo';
    import TopAppBar, { Row, Section, AutoAdjust } from '@smui/top-app-bar';
    import { mdiLightbulbOff, mdiLightbulbOn } from '@mdi/js'
    import { Svg } from '@smui/common';
    import { page } from '$app/stores';

    let topAppBar;

    async function checkIfConnected() {
        const isAccountInfoPresent = $accountInfo.endpoint && $accountInfo.accessKeyId && $accountInfo.secretAccessKey;
        if (!isAccountInfoPresent) {
            await goto('/connect', { replaceState: true });
        } else {
            await fetch('/api/connect', { method: 'POST', body: JSON.stringify($accountInfo) })
            await goto('/queues', { replaceState: true });
        }
    }

    function switchTheme() {
        $isDark = !$isDark;
        let themeLink = document.head.querySelector<HTMLLinkElement>('#theme');
        if (!themeLink) {
            themeLink = document.createElement('link');
            themeLink.rel = 'stylesheet';
            themeLink.id = 'theme';
        }
        themeLink.href = `/smui${$isDark ? '-dark' : ''}.css`;
        document.head
            .querySelector<HTMLLinkElement>('link[href$="/smui-dark.css"]')
            ?.insertAdjacentElement('afterend', themeLink);
    }

    onMount(checkIfConnected)
</script>

<style>
    .container {
        width: 100%;
    }
</style>

<TopAppBar bind:this={topAppBar} variant="standard" style="width: 60%; margin-left: 20%; left: 0">
    <Row>
        <Section>
            <h1>SQS Manager</h1>
        </Section>
        <Section align="end" toolbar>
            <IconButton on:click={switchTheme}>
                {#if $isDark}
                    <Icon component={Svg} viewBox="0 0 24 24" style="color: white">
                        <path fill="currentColor" d={mdiLightbulbOn}></path>
                    </Icon>
                {:else}
                    <Icon component={Svg} viewBox="0 0 24 24" style="color: black">
                        <path fill="currentColor" d={mdiLightbulbOff}></path>
                    </Icon>
                {/if}

            </IconButton>
        </Section>
    </Row>
</TopAppBar>

<AutoAdjust {topAppBar} style="display: flex; justify-content: space-between; width: 60%; margin-left: 20%">
    <div class="container"><slot /></div>
</AutoAdjust>
