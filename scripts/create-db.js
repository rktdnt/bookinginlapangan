#!/usr/bin/env node
// Create MySQL database if it doesn't exist (XAMPP compatible)
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

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
    const parsed = new URL(mysqlUrl);
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username || 'root'),
      password: decodeURIComponent(parsed.password || ''),
      database: parsed.pathname.replace(/^\//, '') || 'bookinginlapangan',
    };
  }

  return {
    host: process.env.MYSQL_HOST || envLocal.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || envLocal.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || envLocal.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || envLocal.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || envLocal.MYSQL_DATABASE || 'bookinginlapangan',
  };
}

(async function() {
  const cfg = getMysqlConfig();
  const conn = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    multipleStatements: true,
  });

  try {
    console.log(`Creating database '${cfg.database}' if not exists...`);
    const safeName = `\`${String(cfg.database).replace(/`/g, '``')}\``;
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${safeName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database '${cfg.database}' is ready.`);
  } catch (err) {
    console.error('Failed to create database:', err.message || err);
    process.exit(1);
  } finally {
    await conn.end();
  }
})();
