export function retrieveAccountInfoFromUrl(url: string): {
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
} {
    const urlObj = new URL(url).searchParams;
    return {
        accessKeyId: urlObj.get('accessKeyId') as string,
        secretAccessKey: urlObj.get('secretAccessKey') as string,
        endpoint: urlObj.get('endpoint') as string
    }
}
