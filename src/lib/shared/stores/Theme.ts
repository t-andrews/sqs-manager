import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialValue = browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;

export const isDark = writable<boolean>(initialValue);
