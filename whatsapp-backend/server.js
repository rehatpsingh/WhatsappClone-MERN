
//importing
import express from "express";
import mongoose from "mongoose";
import Messages from './dbMessages.js';

import Pusher from "pusher";
import cors from  "cors";

//app config
const app = express();
const port = process.env.PORT || 9000;

app.use(cors());

const pusher = new Pusher({
    appId: "1258782",
    key: "8986756af5e695e18be1",
    secret: "16f629853896d1248777",
    cluster: "ap2",
    useTLS: true
});

//middleware
app.use(express.json());
//cors headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "*");
    next();

});

//DB config
const connection_url = 'mongodb+srv://admin:D9BnivhnzHXWqgH@cluster0.u9xky.mongodb.net/whatsappdb?retryWrites=true&w=majority';

mongoose.connect(connection_url)

const db = mongoose.connection

db.once('open', () => {
    console.log("Db connected!");
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log(change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    received: messageDetails.received
                }
            );
        } else {
            console.log('Error triggring pusher')
        }


    });


});

//????
//api routes
app.get("/", (req, res) => res.status(200).send("hello world!"));

app.get("/messages/sync", (req, res) => {


    Messages.find((err, data) => {

        if (err) {

            res.status(500).send(err)

        } else {

            res.status(200).send(data)

        }

    });

});

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {

        if (err) {

            res.status(500).send(err)

        } else {

            res.status(201).send(data)

        }

    });

});
//listen
app.listen(port, ()=> console.log(`Listening on localhost: ${port}`));