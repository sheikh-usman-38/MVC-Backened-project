const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj, owner:'6738bab905926b0cd21b7d1d'}));
    
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();
