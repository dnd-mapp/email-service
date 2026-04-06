import { readFile } from 'fs/promises';

let version: string | undefined;

export async function appVersion() {
    if (version) return version;

    const packageManifestContents = await readFile('package.json', { encoding: 'utf8' });
    const packageManifest = JSON.parse(packageManifestContents) as { version: string };

    version = packageManifest.version;
    return version;
}
