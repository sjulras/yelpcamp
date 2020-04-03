

const express = require('express');
var router = express.Router()
const passport = require("passport")
var Campground = require("../models/campground")
var User = require("../models/user")
var middleware = require("../middleware/")
var async =require("async")
var nodemailer = require("nodemailer")
var crypto = require("crypto")
// var NodeGeocoder = require('node-geocoder');
// var options = {
//   provider: 'google',
//   httpAdapter: 'https',
//   apiKey: process.env.GEOCODER_API_KEY,
//   formatter: null
// };

// var geocoder = NodeGeocoder(options);
router.get("/",function(req,res){
    res.render("landing")
})


// router.get("/campgrounds/new",middleware.isLoggedIn , function(req,res){
//   res.render("campgrounds/new")
// })

// router.post("/campgrounds/", middleware.isLoggedIn, function(req,res){
  
  
//   let fotos;
//   let uploadPathV;
//   console.log(req.files)
//   console.log(req.body.fotos)

  
//   // var name = req.body.name;
//   // var image = dbImage;
//   // var price = req.body.price
//   // var description =req.body.description;
//   // 
//   geocoder.geocode(req.body.location, function (err, data) {
//       if (err || !data.length) {
//           console.log(err.cause)
//         req.flash('error', err.cause);
//         return res.redirect('back');
//       }
//       var lat = data[0].latitude;
//       var lng = data[0].longitude;
//       var location = data[0].formattedAddress;
//       if (!req.files || Object.keys(req.files).length === 0) {
//           var dbImage ="https://png.pngtree.com/png-vector/20190704/ourmid/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg"
//         }else if (req.body.name){
      
//         console.log('req.files >>>', req.files); // eslint-disable-line
      
//         fotos = req.files.fotos;
      
//         uploadPathV= './public/uploads/campgrounds/' + fotos.name;
//         dbImage ='/uploads/campgrounds/' + fotos.name;
//         fotos.mv(uploadPathV, function(err) {
          
//         });}
//         var author={
//               id: req.user._id,
//               username: req.user.username
//           }
//       var newCamp = {name: req.body.name, image: dbImage, description: req.body.description, author:author, price:req.body.price,location: location, lat: lat, lng: lng};
  
//   Campground.create(newCamp,function(err,newCreated){
//       if(err){
//           console.log(err);
//       } else{
//           console.log("add succesfully")
//           console.log(newCreated)
//           res.redirect("/campgrounds")
//       }
//   })
 
// });
// })

//Auth Routes

//Register Form
router.get('/register', (req, res) => {
    res.render("register",{page: 'register'})
    
});



//Signup logic
router.post("/register", (req, res) =>{
    //req.body.username
    
    var admin =false;
    
    if (req.body.adminCode ==='1'){
        var admin =true;
    }
  let avatar;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    var dbImage ="https://png.pngtree.com/png-vector/20190704/ourmid/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg"
  }else if (req.body.username && req.body.email){

  console.log('req.files >>>', req.files); // eslint-disable-line

  avatar = req.files.avatar;

  uploadPath = './public/uploads/userprofile/' + avatar.name;
  dbImage ='/uploads/userprofile/' + avatar.name;
  avatar.mv(uploadPath, function(err) {
    
  });}
    User.register(new User ({
        username:req.body.username, 
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        avatar:dbImage, 
        email:req.body.email, 
        isAdmin:admin
        }),
        req.body.password, function(err,user){
        if (err){
           
          
            return res.render("register",{error: err.message});
            
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Welcome to YelpCamp "+ user.username)
            res.redirect("/campgrounds")
        })
    })
})





router.get ("/login", function(req,res){
    res.render("login",{page: 'login'});
})

router.post('/login', passport.authenticate("local",
{successRedirect:"/campgrounds",
error: "Wrong Username or Password ",
failureRedirect:"/login" }),
(req, res) => {
   
    
});

router.get ("/campgrounds/:id/comments/login", function(req,res){
  
    Campground.findById(req.params.id, function(err, campground){
        console.log(req.params.id)
        if(err){
            console.log(err)
        }else{res.render("loginc",{campground:campground});}
    })
    
})

router.post("/campgrounds/:id/comments/login",function(req,res,next){
    console.log("Kujdesi");
console.log(req.params.id);
// Campground.findById(req.params.id, function(err,campground){
//     if(err){
//         console.log(err)
//     }else{ 
        console.log("kaardj")
        // var a =req.params.id.substring(0, req.params.id.length - 1);
        passport.authenticate('local', {
        successRedirect:'/campgrounds/'+req.params.id.substring(0, req.params.id.length - 1)+'/comments/new',
        failureRedirect:'/campgrounds/'+req.params.id.substring(0, req.params.id.length - 1)+'/comments/login'
    })(req,res,next);
})


   



//passport.authenticate("local",

// {  
//     successRedirect:"/campgrounds/"+req.params.id+"comments/new",
// failureRedirect:"/campgrounds/comments/login"}),
// (req, res) => {
//    console.log(req.body._id)
//  }    
// });



router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "You are logged out! It is a good idea to close your browsers")
     res.redirect('/campgrounds');
});
// forgot password
router.get('/forgot', function(req, res) {
    res.render('forgot');
  });
  
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 7200000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'onlineteamcheck@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'onlineteamcheck@gmail.com',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'onlineteamcheck@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'onlineteamcheck@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/campgrounds');
    });
  });
  

router.get('/user/:user_id',middleware.isSameUser,(req, res)=>{
    
    User.findById(req.params.user_id, function(err, foundUser){
        if (err){
            req.flash("error", "Requested User Profile not Found!!");
            res.redirect("back")
        

        }else{
           
           Campground.find({}, function(err,foundCamps){

            if(err){
                req.flash("error", "Requested User Profile not Found!!");
                console.log(err)
            }else{
                res.render("user/show", {user:foundUser, camps:foundCamps})
            }
           })
                    
                 }
    })
            
   
})

router.get('/userprofile/:user_id', (req, res) => {
  User.findById(req.params.user_id, function(err, usr){
    if (err){
      req.flash("error", "OOOPSSS some error happened")
    }else{
      Campground.find({"author.id":req.params.user_id}, function(err, foundcamp){
        if (err){
          console.log(err)
        }else {
          res.render("user/userprofile", {user:usr,camp:foundcamp })
        }
      })
    }
  })

});

module.exports = router