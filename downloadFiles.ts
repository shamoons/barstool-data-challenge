import axios from 'axios';
import { createGunzip } from 'zlib';
import readline from 'readline';
import { upsertBatchEpisodes } from './db';
import { ParsedData } from './types';

async function streamAndBatchProcessFile(fileUrl: string, batchSize: number) {
  try {
    const response = await axios.get(fileUrl, { responseType: 'stream' });

    const gunzipStream = createGunzip();
    const rl = readline.createInterface({
      input: response.data.pipe(gunzipStream),
      crlfDelay: Infinity,
    });

    let batch: ParsedData[] = [];
    let batchCount = 0;
    let totalBatches = 0;
    let totalLines = 0;

    for await (const line of rl) {
      const data: ParsedData = JSON.parse(line);
      batch.push(data);
      totalLines++;

      if (batch.length >= batchSize) {
        await upsertBatchEpisodes(batch);
        console.log(`\tProcessed batch ${++batchCount} with ${batch.length} lines (Total lines so far: ${totalLines})`);
        totalBatches = batchCount;
        batch = [];
      }
    }

    if (batch.length > 0) {
      await upsertBatchEpisodes(batch);
      console.log(`\tProcessed final batch ${++batchCount} with ${batch.length} lines (Total lines so far: ${totalLines}) for file.`);
      totalBatches = batchCount;
    }

    console.log(`\tFinished processing file. Total lines: ${totalLines}, Total batches: ${totalBatches}`);

  } catch (error) {
    console.error(`Error streaming or processing file: ${fileUrl}`, error);
  }
}

export default streamAndBatchProcessFile;