const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const PORT = 8081;
const MONGO_URL = "mongodb://127.0.0.1:27017/staybnb";
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
    secret: "SECRETKEY", 
    resave: false,
    saveUninitialized: false, 
}

// Router
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");

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
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// Root Route
app.get("/", (req, res) => {
    res.send("Root");
});

// Handling Page not found -
// app.use((req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

// Error Handling Midlleware
app.use((err, req, res, next) => { 
    let { statusCode = 500, message = "Internal Server Error" } = err;
    res.status(statusCode).render("errors/error.ejs", { statusCode, message });
});

app.listen(PORT, () => {
    console.log("Server is running on - ", PORT);
}); 