const express = require("express");
const router = express.Router();

const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: "api",
    key: "44854abd303d4c4a58a5b46152145af0-fe9cf0a8-3a2b5ba2",
});

router.get("/", async(req, res, next) => {
    try {
        mg.messages
        .create("sandboxbfa31a6913b249f8ab29637fdef39c5e.mailgun.org", {
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
