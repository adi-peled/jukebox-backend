const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

module.exports.io = io
// Express App Config
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(session({
    secret: 'asantesanasquashbanana',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))



if (process.env.NODE_ENV === 'production') {
    console.log({ __dirname });
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    };
    app.use(cors(corsOptions));
}
const boxRoutes = require('./api/box/box.routes')
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const socketRoutes = require('./api/socket/socket.routes')

// routes
app.use('/api/box', boxRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/socket', socketRoutes)

const logger = require('./services/logger.service')
const port = process.env.PORT || 5000;
http.listen(port, () => {
    console.log('Server is running on port: ' + port);
    logger.info('Server is running on port: ' + port)
});


// check sync between us



