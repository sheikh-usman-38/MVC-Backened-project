if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}
// console.log(process.env);
const express = require("express");
const app= express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URI = process.env.MONGO_URI
// const dbUrl = process.env.ATLASDB_URL;
// console.log('MONGO_URI:', process.env.ATLASDB_URI);
const listingRouter = require("./routes/listing.js");
const reviewRouter =require("./routes/review.js");
const userRouter =require("./routes/user.js");
const session =require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
async function main(){
     await mongoose.connect(MONGO_URI);
}

main().then(()=>{ console.log("connected to DB")}).catch((err)=>{console.log(err)});
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const store = MongoStore.create({
    mongoUrl:MONGO_URI,
    crypto:{
        secret:   process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});
const sessionOptions ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,

    }
};

// app.get("/",(req ,res)=>{
//     res.send("Hi ! i am root");
// })
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req ,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.all("*",(req,res ,next)=>{
    next(new ExpressError(404,"Page not found"));
})
app.use((err ,req ,res ,next)=>{
    console.error("Error occurred:", err);
    let {statusCode =500 ,message="Something went wrong"} =err;
   
    res.status(statusCode).render("error.ejs",{message});
    res.status(statusCode).send(message);
})



app.listen(8080 ,()=>{
    console.log("app is lisning to 8080");
})
// app.get("/demouser",async(req ,res)=>{
//     let fakeUser = new User({
//         email:"usman@gmail.com",
//         username:"humza"
//     })
//     let registerUser = await User.register(fakeUser,"helloWord");
//     res.send(registerUser);
// })
// app.get("/testListing",async(req, res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })
//index Route
// app.get("/listings",wrapAysnc(async(req ,res)=>{
//    const allListings =await Listing.find({});
//    res.render("listings/index.ejs",{allListings});
// }))
// const validateListing=(req,res,next)=>{
//     let {error} =listingSchema.validate(req.body);   
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }

// const validateReview=(req,res,next)=>{
//     let {error} =reviewSchema.validate(req.body);   
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }
// new route 
// app.get("/listings/new",(req ,res)=>{
//     res.render("listings/new.ejs");
// })
//show Route
// app.get("/listings/:id",wrapAysnc(async(req ,res)=>{
//    let {id} = req.params;
//    const listing = await Listing.findById(id).populate("reviews");
//    res.render("listings/show.ejs",{listing});
// }))
//create route
// app.post("/listings",validateListing ,wrapAysnc(async(req ,res)=>{
//     let newListing =new Listing(req.body.listing);
//         await newListing.save();
//    res.redirect("/listings");
   
// }));
//Edit route
// app.get("/listings/:id/edit",wrapAysnc(async(req ,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing})
// }))
//update route
// app.put("/listings/:id",async(req ,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing });
//     console.log(req.body);
//    res.redirect(`/listings/${id}`);
// })
//my method
// app.put('/listings/:id',validateListing, wrapAysnc(async (req, res) => {
//     const { id } = req.params;
//     const updatedListing = req.body.listing;
//     await Listing.findByIdAndUpdate(id, updatedListing);
//     res.redirect(`/listings/${id}`);
// }));


//delete route
// app.delete("/listings/:id",wrapAysnc(async(req ,res)=>{
//     let {id} = req.params;
//     let deletedListing =await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));

//Reviews Post Routes
// app.post("/listings/:id/reviews",validateReview,wrapAysnc(async(req,res)=>{
//  let listing= await Listing.findById(req.params.id);
//  let newReview = new Review(req.body.review);
//  listing.reviews.push(newReview);
//  await newReview.save();
//  await listing.save();
//  res.redirect(`/listings/${listing._id}`);
// }));

// DElete Reviews Routes
// app.delete("/listings/:id/reviews/:reviewId",wrapAysnc(async(req,res)=>{
//     let {id,reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }))



//Username:usman
// Password:usman@38
//mongodb+srv://usman:<db_password>@cluster0.fbb1g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb+srv://usman:usman@38@cluster0.fbb1g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0