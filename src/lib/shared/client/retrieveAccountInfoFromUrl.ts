export function retrieveAccountInfoFromUrl(url: string): {
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
} {
    const urlObj = new URL(url).searchParams;
    return {
        accessKeyId: urlObj.get('accessKeyId')!,
        secretAccessKey: urlObj.get('secretAccessKey')!,
        endpoint: urlObj.get('endpoint')!
    }
}
