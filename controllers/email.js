const express = require("express");
const router = express.Router();

const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY
});

router.get("/", async(req, res, next) => {
    try {
        mg.messages
        .create("sandbox936d4efff03f4ca3b19d65a15b0b056d.mailgun.org", {
            from: "jamesesguerra025@gmail.com",
            to: ["jamesesguerra025@gmail.com"],
            subject: "Hello world",
            text: "Testing some mailgun awesomeness",
            html: "<h1>Testing some mailgun awesomeness</h1>"
        })
        .then(msg => res.send(msg))
        .catch(err => console.log(err))
    } catch(err) {
        next(err);
    }
});

module.exports = router;
