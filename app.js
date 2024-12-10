//----------------------------------- Basic Set Up Code --------------------------------------//

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express"); // Requiring Express and
const app = express(); // Execute it into app variable
const mongoose = require("mongoose"); // Requiring Mongoose ODM Library
const path = require("path");
const methodOverride = require("method-override"); //Requiring method-override Package for overriding form method                    // Requiring Path package
const ejsMate = require("ejs-mate"); // Requiring ejs-mate package -> improve templating
const session = require("express-session"); // Requiring express session package -> manage the session between client and server (most useful in authentication)
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); // Requiring flash package -> display flash messages(Short messages which is show oly for 1 time)
const passport = require("passport");
const LocalStrategy = require("passport-local");

//temporary requiring user model
const User = require("./models/user.js");
const reviewRouter = require("./routes/review.js"); // Requiring review.js(All review routes)
const listingsRouter = require("./routes/listing.js"); // Requiring listing.js(All listing routes)
const userRouter = require("./routes/user.js"); // Requiring user.js(All user routes)
const ExpressError = require("./utils/ExpressError.js"); // Appending ExpressError Class

// Connect to MongoDB
// MongoDB Atlas  ConnectionString

const dbURl = process.env.ATLASDB_URL;

main() // Establishing Connection with MongoDB
  .then(() => {
    console.log("Conecction Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  // Connection Function
  mongoose.connect(dbURl);
  console.log("connection formed");
}

app.set("view engine", "ejs"); // Setting Our View Engine to ejs
app.set("views", path.join(__dirname, "views")); // Setting Path for view folder
app.use(express.static(path.join(__dirname, "public"))); // Setting Path for public folder
app.use(express.urlencoded({ extended: true })); // Parse the data come from client side
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// Defining mongo store Options

const store = MongoStore.create({
  mongoUrl: dbURl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in MONGO SESSION STORE");
});
// Defining Session Options
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // most use for login
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // use for prevent from (Cross scripting attacks)generally iski significance itni jyada nahi hai par hum security ke liye use krte hai
  },
};

// 1. Basic work of cookie -> track Sessions
// using the session

app.use(session(sessionOptions));
// using the flash
// 1. Use flash before api routes (q ki flash ko hum routes ke sath use krege)
app.use(flash());

// passport ko hum session ke baad use krege(hame passport ko implement krne ke liye session ki jarurat hoti hai)

// koi bhi request aaye to usme passport ko initialize kr de as a middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // authenticate -> user login ya signup krvana

// imp -> pbkd2f hashing algorithm used

passport.serializeUser(User.serializeUser()); // serialization of User -> user se related sari info ko session ke andar  save krana
passport.deserializeUser(User.deserializeUser()); //deserialization of User -> user se related sari info ko session ke andar se remove krana

// middleware to access flash message

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser",async(req,res) => {
//     let user1 = new User({
//         email : "student@gmail.com",
//         username : "delta-student",  // Schema me username nahi tha but fir bhi hum yaha username bhej rhe hai q ki passport khud se schema me username add kr deta hai
//     });
//     let registeredUser = await User.register(user1,"helloworld");//ye method autometically check krta hai ki hamara user unique hai ya nahi
//     res.send(registeredUser);
// })

// Routes

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Error Handling Middlewares

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Going wrong" } = err;
  console.log(err);
  res.status(statusCode).render("./listings/error.ejs", { message });
});

// Server Enable Code

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
