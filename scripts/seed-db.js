#!/usr/bin/env node
// Seed DB with extra data and create indexes from migration 002
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function loadEnvLocal() {
  const out = {};
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) return out;
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      out[key] = value;
    }
  } catch (_) {}
  return out;
}

function getMysqlConfig() {
  const envLocal = loadEnvLocal();
  const mysqlUrl = process.env.MYSQL_URL || process.env.DATABASE_URL || envLocal.MYSQL_URL || envLocal.DATABASE_URL;
  if (mysqlUrl) {
    return { uri: mysqlUrl, multipleStatements: true };
  }
  return {
    host: process.env.MYSQL_HOST || envLocal.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || envLocal.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || envLocal.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || envLocal.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || envLocal.MYSQL_DATABASE || 'bookinginlapangan',
    multipleStatements: true,
  };
}

(async function() {
  const cfg = getMysqlConfig();

  const sql = fs.readFileSync(path.join(__dirname, '..', 'db', 'migrations', '002_indices_and_seed.sql'), 'utf8');
  const conn = cfg.uri
    ? await mysql.createConnection({ uri: cfg.uri, multipleStatements: true })
    : await mysql.createConnection({ ...cfg, multipleStatements: true });
  try {
    console.log('Applying seed and indexes...');
    await conn.query(sql);
    console.log('Seed applied successfully.');
  } catch (err) {
    console.error('Seed failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
})();
