require('dotenv').config();
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const methodOveride = require("method-override");
const flash = require("connect-flash")
//const Campground = require("./models/campground")
const seedDB = require("./seeds")
//const Comment = require("./models/comment")
const User = require("./models/user")
const fileUpload = require('./lib/index');

var commentRoutes = require("./routes/comments")
  var  campgroundRoutes = require("./routes/campgrounds")
    var authRoutes = require("./routes/index")
app.use(fileUpload());
mongoose.connect("mongodb://localhost/yelp_camp",{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    });
app.locals.moment = require("moment")
app.set("view engine", "ejs");
mongoose.set('useCreateIndex', true)
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"))

app.use(methodOveride("_method"));
mongoose.set('useFindAndModify', false);
//seedDB();

//PASSPORT.JS CONFIG
app.use(require("express-session")({
    secret: "I rember the time wwhen you are in here",
    resave: false,
    saveUninitialized: false
    
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res, next){
    res.locals.currentUser=req.user;
    res.locals.error= req.flash("error")
    res.locals.success= req.flash("success")
    next();
})

app.use(flash());

app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(3007, process.env.IP, function(){
    console.log("The YelpCamp Server started!!!")
})