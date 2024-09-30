import fetchFileList from './fetchFiles';
import { createTable } from './db';
import streamAndBatchProcessFile from './downloadFiles';

async function main() {
  await createTable();

  const files = await fetchFileList();

  if (files && files.length > 0) {
    for (const file of files) {
      console.log(`\n\nProcessing file: ${file}`);
      await streamAndBatchProcessFile(file, 500);
    }
    console.log('All files processed successfully.');
  } else {
    console.log('No files to process.');
  }
}

main();