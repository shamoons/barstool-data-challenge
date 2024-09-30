import axios from 'axios';
import { ApiResponse } from './types';

async function fetchFileList() {
  try {
    const response = await axios.get<ApiResponse>('https://data-challenge.origin.barstool.dev/files');
    if (response.status === 200) {
      const files = response.data.files;
      console.log('File List:', files);
      return files;
    } else {
      console.error('Error fetching file list:', response.status);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

export default fetchFileList;