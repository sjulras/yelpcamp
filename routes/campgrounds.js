
const express = require('express');
var router = express.Router({mergeParams:true})
var Campground = require("../models/campground")
const Comment = require("../models/comment")
var middleware = require("../middleware/")
//var fileUpload = require('../lib/index');
var NodeGeocoder = require('node-geocoder');

//router.use(fileUpload());
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

router.get("/",function(req, res){
    if(req.query.search){
        console.log(req.query.search);
        var regex = new RegExp(escapeRegExp(req.query.search),'gi');
        console.log(regex)
        Campground.find({name:regex}, function(err,allCampgrounds){
            if(err){
                console.log(err)
            }else{
                //console.log(allCampgrounds)
                res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user, page: 'campgrounds'});
            }
    
        })
    }else{
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
            //console.log(allCampgrounds)
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user, page: 'campgrounds'});
        }

    })
}
})
router.get("/new",middleware.isLoggedIn , function(req,res){
    res.render("campgrounds/new")
})

router.post("/", middleware.isLoggedIn, function(req,res){
    
    
    let fotos;
    let uploadPathV;
    console.log(req.files)
    console.log(req.body.fotos)
  
    
    // var name = req.body.name;
    // var image = dbImage;
    // var price = req.body.price
    // var description =req.body.description;
    // 
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err)
          req.flash('error', "All the campgrounds location are required");
          return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        if (!req.files || Object.keys(req.files).length === 0) {
            var dbImage ="https://png.pngtree.com/png-vector/20190704/ourmid/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg"
          }else if (req.body.name){
        
          console.log('req.files >>>', req.files); // eslint-disable-line
        
          fotos = req.files.fotos;
        
          uploadPathV= './public/uploads/campgrounds/' + fotos.name;
          dbImage ='/uploads/campgrounds/' + fotos.name;
          fotos.mv(uploadPathV, function(err) {
            
          });}
          var author={
                id: req.user._id,
                username: req.user.username
            }
        var newCamp = {name: req.body.name, image: dbImage, description: req.body.description, author:author, price:req.body.price,location: location, lat: lat, lng: lng};
    
    Campground.create(newCamp,function(err,newCreated){
        if(err){
            console.log(err);
        } else{
            console.log("add succesfully")
            console.log(newCreated)
            res.redirect("/campgrounds")
        }
    })
   
});
})
 router.get("/:id/edit",middleware.checkOwner , function(req,res){
     
            Campground.findById(req.params.id,function(err,foundCamp){
            
            res.render("campgrounds/edit",{campground:foundCamp})
    
       })
   
    
})

router.put("/:id", middleware.checkOwner, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        console.log(data)
      if (err || !data.length) {
        req.flash('error', err);
        console.log(err)
        return res.redirect('back');
      }
      
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      
      let fotos;
      let uploadPathV;
      if (req.files == null){
      var dbImage =req.body.fotos
      console.log(dbImage)
      }
      else{
    
      console.log('req.files >>>', req.files); // eslint-disable-line
    
    
      fotos = req.files.fotos;
    
      uploadPathV= './public/uploads/campgrounds/' + fotos.name;
      dbImage ='/uploads/campgrounds/' + fotos.name;
      fotos.mv(uploadPathV, function(err) {
        
      });}
      //eval (require('locus'))
      Campground.findByIdAndUpdate(req.params.id, { name: req.body.name,
        image:dbImage,
        description:req.body.description,
        price:req.body.price,
        location:location,
        lat:lat,
        lng:lng, },function(err, campground){
      
        if(err){
              req.flash("error", err.message);
              console.log(err)
              res.redirect("back");
             
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });





router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err){
            console.log(err);
        }else{
            console.log(foundCamp)
            res.render("campgrounds/show",{campgrounds:foundCamp});
        }
    })
})

router.delete('/:id', middleware.checkOwner, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
             res.redirect('/camgrounds');
        }else{
             res.redirect('/campgrounds');
        }
    })

});

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

module.exports = router;