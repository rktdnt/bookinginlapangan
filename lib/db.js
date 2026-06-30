import { MongoClient, ObjectId } from "mongodb";

// Re-export ObjectId so routes can import it from here
export { ObjectId };

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "bookinginlapangan";

let client = null;
let clientPromise = null;

function getClientPromise() {
  if (clientPromise) return clientPromise;

  if (process.env.NODE_ENV === "development") {
    // In development, use a global variable so the value is preserved
    // across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
  }

  return clientPromise;
}

/**
 * Returns the connected MongoClient instance.
 */
export async function getClient() {
  return getClientPromise();
}

/**
 * Returns the default database instance.
 */
export async function getDb() {
  const c = await getClientPromise();
  return c.db(MONGODB_DATABASE);
}

/**
 * Convenience helper: returns a typed collection from the default database.
 * @param {string} name - Collection name
 */
export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

/**
 * Convert a string id to ObjectId safely. Returns null if invalid.
 * @param {string} id
 */
export function toObjectId(id) {
  try {
    return new ObjectId(String(id));
  } catch {
    return null;
  }
}

/**
 * Normalize a MongoDB document for JSON output:
 * - renames `_id` to `id` as a string
 */
export function normalizeDoc(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id ? String(_id) : undefined, ...rest };
}

/**
 * Normalize an array of MongoDB documents.
 */
export function normalizeDocs(docs) {
  return (docs || []).map(normalizeDoc);
}
