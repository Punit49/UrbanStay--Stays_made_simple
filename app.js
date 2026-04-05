const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const PORT = 8081;
const MONGO_URL = "mongodb://127.0.0.1:27017/staybnb";
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const flash = require("connect-flash");
require("dotenv").config();
console.log(process.env.S1);


// Session - 
const session = require("express-session");
const sessionOptions = {
    secret: "SECRETKEY",
    resave: false, 
    saveUnintialized: false, 
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
const { CLIENT_RENEG_LIMIT } = require("tls");
const { log } = require("console");

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