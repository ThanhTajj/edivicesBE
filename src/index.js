const express = require("express");
const dotenv = require('dotenv');
const dns = require('dns');
dns.setServers(['8.8.8.8']);
const mongoose = require("mongoose");
const routes = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
mongoose.set('strictQuery', false);
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

routes(app);

mongoose.connect(`${process.env.Mongo_DB}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connect Db success!');
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(port, () => {
    console.log('Server is running on port:', port);
});
