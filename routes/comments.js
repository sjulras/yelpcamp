
const express = require('express');
var router = express.Router({mergeParams:true})
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware/")

router.get("/new", middleware.isLoggedInc,(req, res) => {
    
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new",{campground:campground});
        }
    })

});

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err)
                }else{
                    comment.author.id= req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment)

                    campground.save();
                    req.flash("success", "You have succesfully created a new comment")
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })

});

router.get('/:comment_id/edit', middleware.checkComOwn, (req, res) => {
    Comment.findById(req.params.comment_id, function(err, comment){
        if (err){
            console.log(err)
        }else{
            res.render("comments/edit",{campground_id:req.params.id, comment:comment});
        }
    })
    router.put('/:comment_id', middleware.checkComOwn,(req, res) => {
      
     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
         if(err){
              res.redirect('back');
         }else{
              res.redirect('/campgrounds/'+req.params.id);
         }
     })
    
    });
    
});

router.delete("/:comment_id",middleware.checkComOwn,(req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function(err,){
        if(err){
             res.redirect('back');
        }else{
            req.flash("success", "Comment Deletetd")
             res.redirect('back');
        }
    })
    
});


module.exports=router;