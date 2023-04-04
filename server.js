const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Route files
const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");
const appointment = require("./routes/appointments");

//Load env vars
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();
const app = express();

// Enable CORS, allow cross-origin resource sharing
app.use(cors());

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

////////////////////////////////////// API Security //////////////////////////////////////
// Sanitize data  // prevent NoSQL query injection
app.use(mongoSanitize());

// Set security headers // prevent basic XSS attacks and other attacks by setting HTTP headers appropriately
app.use(helmet());

// Prevent XSS attacks by sanitizing user input
app.use(xss());

// Rate limiting, prevent brute force attacks
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, // 10 mins
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Prevent http param pollution,
app.use(hpp());
/////////////////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  // 1. res.send('<h1>Hello from Express</h1>');
  // 2. res.send({name: 'John', age: 30});
  // 3. res.json({name: 'John', age: 30});
  // 4. res.status(400).json({success:false});
  // 5. res.status(400)
  res.status(200).json({ success: true, data: { id: 1 } });
});

app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointment);

const PORT = process.env.PORT || 5001;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
