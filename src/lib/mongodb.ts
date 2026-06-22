import { MongoClient, Db } from 'mongodb'
import { env } from '@/lib/env'

const MONGODB_URI = env.MONGODB_URI
const DB_NAME = 'daraz_db'

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(MONGODB_URI)
  clientPromise = client.connect()
}

export async function getMongoDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(DB_NAME)
}

export { clientPromise }