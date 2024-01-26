require("dotenv").config();
const { MongoClient } = require("mongodb");
const url = process.env.DATABASE_URL;

const client = new MongoClient(url);

client.connect();

const db = client.db("kittens_sender_bot");
const collection = db.collection("users");

async function addUserToDB(id, username, first_name, kitten) {
  await collection.insertOne({
    id: id,
    username: username,
    kitten: kitten || null,
  });
}

async function updateKitten(id, newKitten) {
  await collection.updateOne({ kitten: id }, { $set: { kitten: null } });
  await collection.updateOne({ kitten: newKitten }, { $set: { kitten: null } });
  await collection.updateOne({ id: id }, { $set: { kitten: newKitten } });
  await collection.updateOne({ id: newKitten }, { $set: { kitten: id } });
}

async function user(id) {
  const user = await collection.findOne({ id: id });
  return user;
}

client.close();

module.exports = { addUserToDB, user, updateKitten };
