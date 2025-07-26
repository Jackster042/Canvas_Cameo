require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const proxy = require("express-http-proxy");
const { authMiddleware } = require("./middlewares/auth-middleware");

const app = express();
const PORT = process.env.PORT || 10000;

// Enhanced CORS configuration
const allowedOrigins = [
    "https://canvas-cameo.vercel.app",
    "http://localhost:3000"
];

app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced Proxy Options
const createProxyOptions = (serviceName) => ({
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/, "/api");
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = {
            ...proxyReqOpts.headers,
            'x-user-id': srcReq.user?.userId || '',
            'x-user-email': srcReq.user?.email || '',
            'Authorization': srcReq.headers.authorization || ''
        };
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
        console.error(`Proxy error to ${serviceName}:`, {
            message: err.message,
            code: err.code,
            stack: err.stack
        });
        res.status(502).json({
            error: "Bad Gateway",
            service: serviceName,
            message: process.env.NODE_ENV === 'development' ? err.message : 'Service unavailable'
        });
    }
});

// Routes with enhanced logging
app.use("/v1/designs",
    authMiddleware,
    proxy(process.env.DESIGN, createProxyOptions('DESIGN'))
);

app.use("/v1/media/upload",
    authMiddleware,
    proxy(process.env.UPLOAD, {
        ...createProxyOptions('UPLOAD'),
        parseReqBody: false
    })
);

app.use("/v1/media",
    authMiddleware,
    proxy(process.env.UPLOAD, {
        ...createProxyOptions('UPLOAD'),
        parseReqBody: true
    })
);

app.use("/v1/subscription",
    authMiddleware,
    proxy(process.env.SUBSCRIPTION, createProxyOptions('SUBSCRIPTION'))
);

// Enhanced health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        services: {
            design: !!process.env.DESIGN,
            upload: !!process.env.UPLOAD,
            subscription: !!process.env.SUBSCRIPTION
        }
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API Gateway running on 0.0.0.0:${PORT}`);
    console.log("Proxying to:");
    console.log(`DESIGN: ${process.env.DESIGN}`);
    console.log(`UPLOAD: ${process.env.UPLOAD}`);
    console.log(`SUBSCRIPTION: ${process.env.SUBSCRIPTION}`);

    if (!process.env.DESIGN || !process.env.UPLOAD || !process.env.SUBSCRIPTION) {
        console.error("WARNING: Missing service environment variables!");
    }
});