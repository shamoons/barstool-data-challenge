import mysql from 'mysql2/promise';
import { ParsedData } from './types';

const connectionConfig = {
  host: 'aws.connect.psdb.cloud',
  user: '58w21miy55vycerlmeac',
  password: 'pscale_pw_4QpmTTTncF3I5ONaJZKtz5v0W86jJegscshkmcxNW78',
  database: 'barstool-data-challenge',
  ssl: {
    rejectUnauthorized: true,
  },
};

export async function getConnection() {
  return mysql.createConnection(connectionConfig);
}

export async function createTable() {
  const connection = await getConnection();
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS parsed_episodes (
      timestamp DATETIME NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      episode_id VARCHAR(255) NOT NULL,
      show_id VARCHAR(255) NOT NULL,
      PRIMARY KEY (episode_id, user_id),
      INDEX idx_timestamp (timestamp)
    );
  `;
  await connection.execute(createTableQuery);
  await connection.end();
}

export async function upsertBatchEpisodes(batch: ParsedData[]) {
  const connection = await getConnection();

  const query = `
    INSERT INTO parsed_episodes (timestamp, user_id, episode_id, show_id)
    VALUES ${batch.map(() => '(?, ?, ?, ?)').join(', ')}
    ON DUPLICATE KEY UPDATE
      timestamp = VALUES(timestamp),
      user_id = VALUES(user_id),
      episode_id = VALUES(episode_id),
      show_id = VALUES(show_id);
  `;

  const values = batch.flatMap(data => [
    data.TIMESTAMP,
    data.USER_ID,
    data.EPISODE_ID,
    data.SHOW_ID
  ]);

  try {
    if (values.some(v => v === undefined || v === null)) {
      console.error('Error: Undefined or null value found in batch', values);
    } else {
      await connection.query(query, values);
    }
  } catch (error) {
    console.error('Error executing batch insert:', error);
  }

  await connection.end();
}