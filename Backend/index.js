const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const path = require("path");
const multer = require("multer");


dotenv.config();

const Connection = require("./dbConnection");
Connection();

const app = express();

// ======================= Trust Proxy for Cloud Deployment ===============
app.set('trust proxy', 1); // Trust first proxy for cloud platforms like Fly.dev

// ======================= Security Middleware ============================
app.use(helmet()); // secure headers
app.use(xss()); // prevent XSS attacks
app.use(mongoSanitize()); // prevent Mongo injection
app.use(express.json({ limit: "10mb" }));
 // limit request payload

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Max 1000 reqs per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes."
});
app.use(limiter);

// ======================= Payload Config ================================
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// ======================= CORS ==========================================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001" ,
   "http://127.0.0.1:3000",              // Local dev
  "https://tathagat.satyaka.in",            // Production domain
  "https://602013ebf633402e8096c9cab19561d7-38235a13d63b4a5991fa93f6f.fly.dev",  // Previous deployment
  "https://56e17d465c834696b5b3654be57883bc-f85b5f4c5dc640488369d7da4.fly.dev"  // Current frontend deployment
];

app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));


// ======================= Logger ========================================
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // 👈 for testing, use * (later tighten to 3000 only)
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // ✅ THIS fixes image preview!
  next();
});




app.use("/uploads", express.static(path.join(__dirname, "uploads")));




// ======================= Health Check ========================================
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Backend server is running",
        timestamp: new Date().toISOString()
    });
});

// ======================= Test Endpoint ========================================
app.get("/api/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is working in production",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// ======================= Development Mock Data ========================================
// if (process.env.NODE_ENV !== 'production') {
//     // Removed duplicate route - using real controller from CourseRoute.js

//     app.get("/api/user/student/my-courses", (req, res) => {
//         res.status(200).json({
//             success: true,
//             courses: []
//         });
//     });

//     app.get("/api/v1/auto-login", (req, res) => {
//         res.status(200).json({
//             exists: false,
//             message: "Auto-login disabled in development mode"
//         });
//     });
// }

// ======================= Request Logging for Debugging ========================================
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ======================= Routes ========================================
const authEmailRoutes = require("./routes/authEmailRoutes");
const authPhoneRoutes = require("./routes/authPhoneRoutes");
const userRoutes = require("./routes/userRoutes");
const OTP = require("./routes/Otp");
const IIMPredictor = require("./routes/IIMPredictor");
const ResponseSheet = require("./routes/ResponseSheet");

const blogRoutes = require("./routes/blogRoutes");
 const adminRoute = require("./routes/AdminRoute");
const subAdminRoute = require("./routes/SubAdminRoute");
const courseRoutes = require("./routes/CourseRoute");
const subjectRoutes = require("./routes/SubjectRoute");
const chapterRoute = require("./routes/ChapterRoute");
const topicRoutes = require("./routes/TopicRoute");
const testRoutes = require("./routes/TestRoute");
const questionRoutes = require("./routes/QuestionRoute");
const responseRoutes = require("./routes/ResponseRoute");
const uploadRoute = require("./routes/UploadRoute");
const bulkUploadRoute = require("./routes/bulkUpload");
const zoomRoute = require("./routes/zoom");
// const practiceTestRoutes = require("./routes/practiceTestRoutes");

app.use("/api/auth/email", authEmailRoutes);
app.use("/api/auth/phone", authPhoneRoutes);
app.use("/api/user", userRoutes);
app.use("/api/v1", OTP);
app.use("/api/v2", IIMPredictor);
app.use("/api/v3", ResponseSheet);
 app.use("/api/admin", adminRoute);
app.use("/api/admin/bulk-upload", bulkUploadRoute);
app.use("/api/admin/zoom", zoomRoute);

app.use("/api/v5", blogRoutes);

app.use("/api/subadmin", subAdminRoute);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoute);
app.use("/api/topics", topicRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/upload", uploadRoute);
// app.use("/api/practice-tests", practiceTestRoutes);

// ======================= Global Error Handler ==========================
app.use((err, req, res, next) => {
    console.error("❌ Global Error:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    })
});

// Removed duplicate static serving - handled in production block below

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, url: fileUrl });
});

// 👇 Production static file serving - Temporarily disabled for debugging
// The build directory doesn't exist, so let's focus on getting API working first
if (process.env.NODE_ENV === "production") {
  console.log("🚀 Production mode detected, but build directory not found");
  console.log("📁 Looking for build directory at:", path.join(__dirname, "../Frontend/build"));

  // Only serve API routes for now
  app.get("/", (req, res) => {
    res.json({
      message: "Backend API is running",
      health: "/api/health",
      test: "/api/test",
      courses: "/api/courses/student/published-courses"
    });
  });
}



// ======================= Server Start ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
