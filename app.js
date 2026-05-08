const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const PORT = 8081;
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const flash = require("connect-flash");
require("dotenv").config();
const MONGO_URL = process.env.MONGODB_CONNECTION_STRING;
const MONGO_SECRET = process.env.MONGO_SECRET;

// Session - 
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const store = MongoStore.create({
    mongoUrl: MONGO_URL, 
    crypto: {
        secret: process.env.MONGO_SECRET 
    }, 
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("ERROR IN SESSION STORE", err);
})

const sessionOptions = {
    store: store,
    secret: "SECRETKEY",
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 * 7,
        httpOnly: true,
        secure: false
    } 
};

// Router
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const apiRouter = require("./routes/api.js");

// Database connection
main().then(res => {
    console.log("Connected To DB");
}).catch(err => {
    console.log(err);
});

async function main(){ 
    await mongoose.connect(MONGO_URL);
};
 
// Configurations 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.isLogin = req.isAuthenticated();
    res.locals.curUser = req.user;
    next();
});

// Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/api", apiRouter);

// Root Route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Handling Page not found -
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error Handling Midlleware
app.use((err, req, res, next) => { 
    let { statusCode = 500, message = "Internal Server Error" } = err;
    res.status(statusCode).render("errors/error.ejs", { statusCode, message });
});

app.listen(PORT, () => {
    console.log("Server is running on - ", PORT);
}); 