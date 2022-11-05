import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface AccountInfo {
    endpoint: string|null;
    accessKeyId: string|null;
    secretAccessKey: string|null;
}

const defaultValue: AccountInfo = {
    endpoint: null,
    accessKeyId: null,
    secretAccessKey: null
};

function getLocalStorageValue() {
    const localValue = window.localStorage.getItem('accountInfo');
    return localValue ? JSON.parse(localValue) as AccountInfo : defaultValue
}

const initialValue = browser ? getLocalStorageValue() : defaultValue;

export const accountInfo = writable<AccountInfo>(initialValue);

accountInfo.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('accountInfo', JSON.stringify(value));
    }
});
