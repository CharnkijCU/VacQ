const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Route files
const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");

//Load env vars
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();
const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

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
