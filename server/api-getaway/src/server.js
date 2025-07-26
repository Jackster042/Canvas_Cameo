require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const proxy = require("express-http-proxy");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middlewares/auth-middleware");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(helmet());


app.use(cors({
    origin: [
        "https://canvas-cameo.vercel.app", // Explicit production URL
        "http://localhost:3000" // Local dev
    ],
    credentials: true, // REQUIRED for withCredentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PROXY OPTIONS (updated version)
const proxyOptions = {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/, "/api");
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // Forward CORS headers
        proxyReqOpts.headers = {
            ...proxyReqOpts.headers,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': srcReq.headers.origin || allowedOrigins[0]
        };
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
        console.error('Proxy error:', err);
        res.status(502).json({
            message: "Bad Gateway",
            error: err.message
        });
    }
};

app.use(
  "/v1/designs",
  authMiddleware,
  proxy(process.env.DESIGN, { ...proxyOptions })
);

app.use(
  "/v1/media/upload",
  authMiddleware,
  proxy(process.env.UPLOAD, {
    ...proxyOptions,
    parseReqBody: false,
  })
);

app.use(
  "/v1/media",
  authMiddleware,
  proxy(process.env.UPLOAD, {
    ...proxyOptions,
    parseReqBody: true,
  })
);

// TODO: SUBSCRIPTION SERVICE LATER
app.use(
  "/v1/subscription",
      authMiddleware,
      proxy(process.env.SUBSCRIPTION, { ...proxyOptions })
);

// Health Check
app.get("/health", (req, res) => res.sendStatus(200));

app.listen(PORT,"0.0.0.0", () => {
    console.log(`API Gateway running on 0.0.0.0:${PORT}`);
    console.log(`Proxying to:`);
  console.log(`DESIGN Service is running on port ${process.env.DESIGN}`);
  console.log(`UPLOAD Service is running on port ${process.env.UPLOAD}`);
  console.log(
    `SUBSCRIPTION Service is running on port ${process.env.SUBSCRIPTION}`
  );
});
