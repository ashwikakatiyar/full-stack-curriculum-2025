// install
const express = require('express');
const app = express();

// import env variables
require('dotenv').config();

app.use(express.json());

// fake database
const tweets = [
    { id: 1, user: "Ryan", tweet: "ChatGPT" },
    { id: 2, user: "Mohammad", tweet: "Hello World!" }
];

// middleware
const validateInput = (req, res, next) => {
    const user = req.body.user;
    const tweet = req.body.tweet;
    if(!tweet || !user) {
        res.status(400).json({error: "Incomplete input"});
    } else {
        next();
    }
}

// get tweet by user
app.get("/api/tweets/:user", (req, res) => {
    let target = tweets.find((t) => t.user == req.params.user);
    if (!target) {
        res.status(404).send("User not found");
    } else {
        res.send(target);
    }
});

// post a tweet
app.post("/api/tweets", validateInput, (req, res) => {
    let prev_tweet_id = tweets[tweets.length - 1].id;
    let tweet = {
        id: prev_tweet_id + 1,
        user: req.body.user,
        tweet: req.body.tweet
    }
    tweets.push(tweet);
    res.send(tweet);
});

// delete a tweet 
app.delete("/api/tweets", (req, res) => {
    let tweetIndex = tweets.findIndex((tweet) => tweet.id == req.body.id);
    if(tweetIndex == -1) {
        res.status(404).send("Tweet not found");
    } else {
        // Remove the tweet
        let removed = tweets[tweetIndex];
        console.log(removed);
        tweets.splice(tweetIndex, 1);
        res.json(removed);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on post ${port}`))