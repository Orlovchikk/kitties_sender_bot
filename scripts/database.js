require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const url = process.env.DATABASE_URL;

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db, collection;

async function connectDB() {
  try {
    console.log("db1")
    await client.connect();
    
    await client.db("orlovchik").command({ ping: 1 });
    console.log("Успешное подключение к MongoDB!");

    db = client.db("kittens_sender_bot");
    collection = db.collection("users");
    console.log("db2");
  } catch (error) {
    console.error("Не удалось подключиться к MongoDB", error);
    process.exit(1);
  }
}

async function addUserToDB(id, username, first_name, kitten) {
  const existingUser = await collection.findOne({ id: id });
  if (existingUser) {
    console.log(`Пользователь с ID ${id} уже существует.`);
    return;
  }
  await collection.insertOne({
    id: id,
    username: username,
    first_name: first_name,
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

module.exports = { connectDB, addUserToDB, user, updateKitten };
