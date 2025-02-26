const Listing  = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// const fetch = require('node-fetch');

module.exports.index= async(req ,res)=>{
    const allListings =await Listing.find({});
    res.render("listings/index.ejs",{allListings})
};
module.exports.renderNewForm =(req ,res)=>{    
    res.render("listings/new.ejs");
}
module.exports.showListing = async(req ,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author",},})
    .populate("owner");
    if(!listing){
        req.flash("error"," Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
 }
 module.exports.createListing = async(req ,res)=>{
//   let response= await geocodingClient.forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1
//       })
//         .send();
//         console.log(response.body.features[0].geometry);
//         res.send("done!");
       
    let url = req.file.path;
    let filename =req.file.path;  
    let newListing =new Listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image ={url,filename};
        await newListing.save();
        req.flash("success","New Listing created!");
   res.redirect("/listings");   
}
 

// module.exports.createListing = async (req, res) => {
//     // Ensure the image file was uploaded
//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }
  
//     try {
//       let url = req.file.path;  // Path to the uploaded file
//       let filename = req.file.filename; // Filename for the uploaded file
  
//       // Create a new listing object using the provided form data
//       let newListing = new Listing(req.body.listing);
//       newListing.owner = req.user._id;  // Assuming you're using a user authentication system
//       newListing.image = { url, filename };  // Save the file details
  
//       // Save the listing to the database
//       await newListing.save();
  
//       req.flash("success", "New Listing created!");
//       res.redirect("/listings");  // Redirect to listings page
//     } catch (error) {
//       console.error('Error occurred while creating listing:', error);
//       res.status(500).send('Error creating listing');
//     }
//   };
  
  
module.exports.renderEditForm =async(req ,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error"," Listing you requested for does not exist");
       res.redirect("/listings");
   }
   let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing ,originalImageUrl })
}
module.exports.updateListing =async (req, res) => {
      
    const { id } = req.params;
    const updatedListing = req.body.listing;
    let listing= await Listing.findByIdAndUpdate(id, updatedListing);
    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename =req.file.path;
   listing.image ={url,filename};
   await listing.save();
}
     req.flash("success","Listing Updated!");
     res.redirect(`/listings/${id}`);
 }
 module.exports.destoryListing=async(req ,res)=>{
    let {id} = req.params;
    let deletedListing =await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}


// exports.getListingsByCategory = async (req, res) => {
   
//         const category = req.params.category;  // Get category from the URL
    
//         try {
//             const listings = await Listing.find({ category });  // Filter listings by category
//             console.log(`Listings for category ${category}:`, listings);
    
//             res.render('listings/index', { allListings: listings });  // Pass the filtered listings to the view
//         } catch (error) {
//             console.error('Error fetching listings by category:', error);
//             res.status(500).send('Server Error');
//         }
// };
