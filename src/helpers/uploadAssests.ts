import axios from 'axios';

async function downloadFile(url: string): Promise<string> {
  try {

    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  } catch (error) {
    throw new Error(`Error downloadFile media: ${(error as Error)?.message} `);
  }
}

export default async function downloadAssets(url: string) {
  try {
    const response = await downloadFile(url);
    return response
  } catch (error) {
    console.error(error);
    throw new Error(`Error downloadAssets media: ${(error as Error)?.message} `);
  }
}

