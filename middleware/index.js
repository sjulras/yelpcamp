//Middlewares
var middlewareObj={};
var Campground = require("../models/campground")
var Comment = require("../models/comment")
middlewareObj.checkComOwn= function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,comment){
            if (err){
                console.log(err)
                 res.redirect('back');
                 
            }else{
        if(comment.author.id.equals(req.user._id)|| req.user.isAdmin){
            next()
            
        }  else   {
        req.flash("error", "No permmisions")   
             res.redirect('back');
        }
       
       }})
     }else{
          res.redirect('back');
     }
}
middlewareObj.isLoggedIn = function(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to commit this action!")
    res.redirect("/login")
}
middlewareObj.isLoggedInc = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        Campground.findById(req.body.id, function(err, campground){
            if(err){

                console.log(err)
            }else{
                console.log(req.params.id)
                req.flash("error", "You need to be logged in to comment on Campgrounds")
                res.redirect("/campgrounds/"+req.params.id+"/comments/login")
            }
        })
    }
}

middlewareObj.checkOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCamp){
            if (err){
                req.flash("error", "DB connection lost")
                console.log(err)
                 res.redirect('back');
            }else{
        if(foundCamp.author.id.equals(req.user._id)|| req.user.isAdmin){
            next()
            
        }  else      {

            req.flash("error", "You do not have permmision for this")            
            res.redirect('back');
        }
       
       }})
     }else{
         req.flash("error", "Do you really think that i couldnt predict this")
          res.redirect('back');
     }
}

middlewareObj.isSameUser = function(req,res, next){
    if(req.isAuthenticated())//&& req.user.id === req.params.user_id)
    {
        return next();
    }
    req.flash("error", "You should be logged in to visit a user profile")
   res.redirect("/login")
}

    
module.exports = middlewareObj