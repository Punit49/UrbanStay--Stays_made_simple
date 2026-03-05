const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://cdni.iconscout.com/illustration/premium/thumb/house-illustration-svg-download-png-3960659.png",
        set: (v) => 
            v === "" ? "https://cdni.iconscout.com/illustration/premium/thumb/house-illustration-svg-download-png-3960659.png" : v 
    },
    price: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
    },
    country: {
        type: String
    },
    reveiws: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;