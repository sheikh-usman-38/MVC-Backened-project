const express = require("express");
const router =express.Router({mergeParams:true});
const wrapAysnc = require("../utils/wrapAysnc.js");
// const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn,isReviewAuthor} =require("../middleWare.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController = require('../controllers/reviews.js')
//Reviews Post Routes
router.post("/",isLoggedIn,validateReview,wrapAysnc(reviewController.createReview));
   
   // DElete Reviews Routes
   router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAysnc(reviewController.destroyReview));
   module.exports = router;