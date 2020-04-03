var mongoose = require("mongoose");
var Campground = require("./models/campground")
var Comment = require("./models/comment")
var data =[
    {
        name:" Clouds", 
        image:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80", 
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis posuere morbi leo urna molestie. Tristique senectus et netus et. Sit amet consectetur adipiscing elit ut aliquam. Lacus sed turpis tincidunt id aliquet. Nunc mi ipsum faucibus vitae aliquet. Condimentum lacinia quis vel eros donec ac odio. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Diam sit amet nisl suscipit adipiscing bibendum est ultricies. Facilisis gravida neque convallis a cras. Convallis tellus id interdum velit laoreet. Justo donec enim diam vulputate ut pharetra sit. Sem viverra aliquet eget sit amet tellus cras. Sed id semper risus in hendrerit. Odio aenean sed adipiscing diam donec adipiscing tristique risus nec. Sollicitudin ac orci phasellus egestas tellus rutrum. Penatibus et magnis dis parturient montes nascetur."
    },{
        name:" Sun Flower", 
        image:"https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", 
        description:"Nec tincidunt praesent semper feugiat nibh. Non diam phasellus vestibulum lorem sed risus ultricies tristique. Lobortis feugiat vivamus at augue eget arcu. Orci dapibus ultrices in iaculis nunc sed augue. Non blandit massa enim nec dui nunc mattis enim ut. At erat pellentesque adipiscing commodo elit. Auctor augue mauris augue neque gravida in fermentum et. Tortor condimentum lacinia quis vel eros donec ac odio tempor. Dui faucibus in ornare quam viverra. Elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Amet mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Pretium viverra suspendisse potenti nullam ac tortor. Nunc sed id semper risus in hendrerit gravida. Odio pellentesque diam volutpat commodo. A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Id venenatis a condimentum vitae sapien."
    },
    {
        name:"Skyfall", 
        image:"https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", 
        description:"Nec tincidunt praesent semper feugiat nibh. Non diam phasellus vestibulum lorem sed risus ultricies tristique. Lobortis feugiat vivamus at augue eget arcu. Orci dapibus ultrices in iaculis nunc sed augue. Non blandit massa enim nec dui nunc mattis enim ut. At erat pellentesque adipiscing commodo elit. Auctor augue mauris augue neque gravida in fermentum et. Tortor condimentum lacinia quis vel eros donec ac odio tempor. Dui faucibus in ornare quam viverra. Elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Amet mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Pretium viverra suspendisse potenti nullam ac tortor. Nunc sed id semper risus in hendrerit gravida. Odio pellentesque diam volutpat commodo. A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Id venenatis a condimentum vitae sapien."
    }
]
function seedDB(){
    Campground.deleteMany({}, function(err){
        if(err){
            Console.log(err)
            
        }else {
            console.log("DB cleared")
            data.forEach(seed => {
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else{
                        console.log("Data added succefully")
                        Comment.create(
                            {text: "this is a great place i like it here",
                            author:"Berti"
                        }, function(err, comment){
                            if (err){
                                console.log(err)
                            } else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created a new comment")

                            }
                           
                        })
                    }
                })
            });
        }
     })
    
}
module.exports =seedDB;