import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const sslCaPath = path.join(process.cwd(), 'DigiCertGlobalRootCA.crt.pem');

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(sslCaPath),
  },
  waitForConnections: true,
  connectionLimit: 10,
});