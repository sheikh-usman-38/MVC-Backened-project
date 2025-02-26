const express = require("express");
const router =express.Router();

const wrapAysnc = require("../utils/wrapAysnc.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner ,validateListing} = require("../middleWare.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage } = require("../cloudConfig.js");
const upload = multer({ storage});
     
       router.route("/")
//index Route
.get(wrapAysnc(listingController.index))
//create route
.post(isLoggedIn ,upload.single('listing[image]'),validateListing,
   wrapAysnc(listingController.createListing));
// .post(upload.single('listing[image][url]'),(req ,res)=>{
//     res.send(req.file);
    
// })
   // new route 
 router.get("/new",isLoggedIn,listingController.renderNewForm);
 
   router.route("/:id")
   //show Route
   .get(
      wrapAysnc(listingController.showListing))
       //update route
      .put(
         isLoggedIn,
         isOwner,
         upload.single('listing[image]'),
         validateListing,
          wrapAysnc(listingController.updateListing))
          //delete route
      .delete(
            isLoggedIn,
            isOwner,
            wrapAysnc(listingController.destoryListing))
 
 //Edit route
 router.get("/:id/edit",isLoggedIn,isOwner,
     wrapAysnc(listingController.renderEditForm));

   //   router.get('/category/:category', listingController.getListingsByCategory);
   //   router.get('/category/:Trending', listingController.getListingsByCategory);
   //   router.get('/category/:Rooms', listingController.getListingsByCategory);
   //   router.get('/category/:Iconic cities', listingController.getListingsByCategory);
   //   router.get('/category/:Mountains', listingController.getListingsByCategory);
   //   router.get('/category/:Castle', listingController.getListingsByCategory);
   //   router.get('/category/:Amazing Pool', listingController.getListingsByCategory);
   //   router.get('/category/:Camping', listingController.getListingsByCategory);
   //   router.get('/category/:Farms', listingController.getListingsByCategory);
   //   router.get('/category/:Arctic', listingController.getListingsByCategory);
 module.exports = router;
