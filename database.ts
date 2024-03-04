import { MongoClient } from "mongo";

import config from "$env";

console.log("Connecting to MongoDB...");
const client = new MongoClient();
const MONGO_URL = new URL(config.MONGO_URI);
if (!MONGO_URL.searchParams.has("authMechanism")) {
  MONGO_URL.searchParams.set("authMechanism", "SCRAM-SHA-1");
}
try {
  await client.connect(MONGO_URL.href);
} catch (err) {
  console.error("Error connecting to MongoDB", err);
  throw err;
}
const db = client.database("INCEPTRA-ATTENDANCE");

interface AttendanceSchema {
  agentID: string;
}

const attendance = db.collection<AttendanceSchema>("attendance");

async function addAgent(agentID: string) {
  console.log(await attendance.find({}).toArray());

  if (!(await attendance.findOne({ agentID }))) {
    await attendance.insertOne({ agentID });
    return true;
  }
  return false;
}

export { addAgent };
