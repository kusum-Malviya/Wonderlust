const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust"; // MongoDB ConnectionString
const dbURl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Conecction Successful");
  }) // Establishing Connection with MongoDB
  .catch((err) => console.log(err));

async function main() {
  // Connection Function
  await mongoose.connect("mongodb+srv://kirtanmalviya49:k7Bh0b1lzSijl8SA@cluster0.tcw49.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6757d92be77a68c3996e05bb",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was Initialized");
};

initDB();
