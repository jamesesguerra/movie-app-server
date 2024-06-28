const express = require("express");
const router = express.Router();

const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY
});

router.post("/", async(req, res, next) => {
    const {
        mall, movie, restaurant, request
    } = req.body;

    try {
        mg.messages
        .create("sandbox936d4efff03f4ca3b19d65a15b0b056d.mailgun.org", {
            from: "jamesesguerra025@gmail.com",
            to: ["jamesesguerra025@gmail.com"],
            subject: "hbd site reply",
            text: `I wanna go to ${mall}, watch ${movie}, eat ${restaurant}, and my request is ${request}`,
            html: `<p>I wanna go to ${mall}, watch ${movie}, eat ${restaurant}, and my request is ${request}</p>`
        })
        .then(msg => res.send(msg))
        .catch(err => console.log(err))
    } catch(err) {
        next(err);
    }
});

module.exports = router;
