import mongoose from "mongoose";
import consola from "consola";

async function connect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    return consola.success("Successfully connected to Db");
  } catch (err) {
    return consola.error("Can't connected to DB", err.message);
  }
}

async function disconnect() {
  try {
    await mongoose.connection.close();
    return consola.info("Disconnected from Db");
  } catch (err) {
    return consola.error("Can't disconnected from Db", err.message);
  }
}

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;