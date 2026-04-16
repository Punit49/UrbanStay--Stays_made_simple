const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/staybnb";

main().then(res => {
    console.log("Connected To DB");
}).catch(err => {
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map(obj => ( {...obj, owner: "69caab45eff281fa255add6b"} ));
    await Listing.insertMany(initData.data);
    console.log("Data was intialized");
}

initDB();

const initReviews = async () => {
    await Review.deleteMany({});
    console.log("Reviews Table Emptied");
}

// initReviews();