export async function clientFetch(endpoint: string, accountInfo: { endpoint: string, accessKeyId: string, secretAccessKey: string }, requestParams: RequestInit = { method: 'GET' }) {
    return fetch(`${endpoint}?endpoint=${accountInfo.endpoint}&accessKeyId=${accountInfo.accessKeyId}&secretAccessKey=${accountInfo.secretAccessKey}`, requestParams);
}
