require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const url = `mongodb+srv://${process.env.BD_USERNAME}:${process.env.BD_PASSWORD}@cluster0.cevzg9e.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(url);

client.connect()

const db = client.db('kittens_sender_bot')
const collection = db.collection('users')

async function addUserToDB(id, username, kitten) {
  await collection.insertOne({
    "id": id,
    "username": username,
    "kitten": kitten || null
  })
}

async function updateKitten(id, newKitten) {
  await collection.updateOne({ id: id }, { $set: { "kitten": newKitten } })
}

async function deleteKitten(id) {
  await collection.updateOne({ kitten: id }, { $set: { "kitten": null } })
}

async function user(id) {
  const user = await collection.findOne({ id: id })
  return user
}

client.close()

module.exports.addUserToDB = addUserToDB,
  module.exports.user = user,
  module.exports.updateKitten = updateKitten,
  module.exports.deleteKitten = deleteKitten