const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
 description: String,
//  image: {
//  filename: {
//             type: String,
//             default: 'listingimage',
//         },
//  url: {
//      type: String,
//      default : 'https://images.unsplash.com/photo-1726500087639-0a68be284497?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D',  
//       set: v => v === " " ? this.default : v,         
//          }
//         },
    image:{
        url:String,
        filename:String,
    },
    
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
//     category: {
//     type: String,
//     enum: [
//       'Trending',
//       'Rooms',
//       'Iconic cities',
//       'Mountains',
//       'Castle',
//       'Amazing Pool',
//       'Camping',
//       'Farms',
//       'Arctic',
//     ],
//     required: true,
//   },
    
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }

});
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
