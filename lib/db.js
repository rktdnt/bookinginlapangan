import mysql from "mysql2/promise";

let pool = null;

function readConfig() {
  const mysqlUrl = process.env.MYSQL_URL || process.env.DATABASE_URL || "";
  if (mysqlUrl) {
    return { uri: mysqlUrl };
  }

  const host = process.env.MYSQL_HOST || "localhost";
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "bookinginlapangan";

  return { host, port, user, password, database };
}

function getPool() {
  if (pool) return pool;

  const cfg = readConfig();
  pool = cfg.uri
    ? mysql.createPool({ uri: cfg.uri, connectionLimit: 10 })
    : mysql.createPool({
        host: cfg.host,
        port: cfg.port,
        user: cfg.user,
        password: cfg.password,
        database: cfg.database,
        waitForConnections: true,
        connectionLimit: 10,
      });

  return pool;
}

export async function query(text, params = []) {
  const conn = await getPool().getConnection();
  try {
    const [rows] = await conn.query(text, params);
    return rows;
  } finally {
    conn.release();
  }
}

export async function transaction(work) {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await work(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
