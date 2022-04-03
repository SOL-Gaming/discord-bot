import fetch from 'node-fetch';

export async function getJson(fileId) {
    const uri = `http://217.160.240.86:3331/files/${fileId}`;

    return await fetch(uri)
        .then(response => response.json())
}