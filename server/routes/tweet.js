/**
  This file contains endpoints for interacting with a single tweet.
*/

const lodash = require('lodash');

const router = require('express').Router();

const data = require('../data');

const {
  CURRENT_USER_HANDLE,
  resolveRetweet,
  denormalizeTweet,
  simulateProblems,
} = require('./routes.helpers.js');

const createTweet = (status, { isRetweet }) => {
  const newTweetId = Math.random() * 10 ** 18;
  const timestamp = new Date().toISOString();

  let sharedTweetBasics = {
    id: newTweetId,
    authorHandle: CURRENT_USER_HANDLE,
    timestamp,
    sortedTimestamp: timestamp,
  };

  if (isRetweet) {
    // HACK: ideally, this `createTweet` function should also link retweets
    // to their parent, with the `retweetOf` field. This is a shitty
    // abstraction, but it's the best one I could come up with :/
    return sharedTweetBasics;
  } else {
    return {
      ...sharedTweetBasics,
      likedBy: [],
      retweetedBy: [],
      status: status,
      media: [],
    };
  }
};

/**
 * Get the specified tweet
 */
router.get('/api/tweet/:tweetId', (req, res) => {
  let tweet = data.tweets[req.params.tweetId];

  tweet = resolveRetweet(tweet);
  tweet = denormalizeTweet(tweet);

  return simulateProblems(res, { tweet });
});

/**
 * Post a new tweet
 */
router.post('/api/tweet', (req, res) => {
  const newTweet = createTweet(req.body.status, { isRetweet: false });
  data.tweets[newTweet.id] = newTweet;

  return simulateProblems(res, { tweet: newTweet });
});

/**
 * Like a tweet
 */
router.put('/api/tweet/:tweetId/like', (req, res) => {
  const { like } = req.body;

  const tweet = data.tweets[req.params.tweetId];

  if (!tweet) {
    res.sendStatus(404);
    return;
  }

  if (typeof like !== 'boolean') {
    res.status(400).json({
      error: 'Please specify whether to "like" or "unlike" this tweet.',
    });
    return;
  }

  console.log(tweet);

  // Disallow "repeat" requests (eg trying to like an already-liked tweet).
  const currentlyLiked = tweet.likedBy.includes(CURRENT_USER_HANDLE);

  if (like === currentlyLiked) {
    res.status(409).json({
      error:
        'You are not allowed to like an already-liked tweet, or unlike an already-unliked tweet.',
    });
    return;
  }

  if (like) {
    tweet.likedBy.push(CURRENT_USER_HANDLE);
  } else {
    tweet.likedBy = data.tweets[req.params.tweetId].likedBy.filter(
      handle => handle !== CURRENT_USER_HANDLE
    );
  }

  return res.json({ success: true });
});

// NOTE: this is super not-dry, but a good abstraction escapes me.
// Probably not ideal, but also not as bad as a leaky abstraction.
router.put('/api/tweet/:tweetId/retweet', (req, res) => {
  const { retweet } = req.body;

  const tweet = data.tweets[req.params.tweetId];

  if (!tweet) {
    res.sendStatus(404);
    return;
  }

  if (typeof retweet !== 'boolean') {
    res.status(400).json({
      error: 'Please specify whether to "retweet" or "unretweet" this tweet.',
    });
    return;
  }

  // Disallow "repeat" requests (eg trying to like an already-liked tweet).
  const currentlyRetweeted = tweet.retweetedBy.includes(CURRENT_USER_HANDLE);

  if (retweet === currentlyRetweeted) {
    res.status(409).json({
      error:
        'You are not allowed to like an already-liked tweet, or unlike an already-unliked tweet.',
    });
    return;
  }

  if (retweet) {
    tweet.retweetedBy.push(CURRENT_USER_HANDLE);

    const retweet = createTweet(null, { isRetweet: true });
    retweet.retweetOf = req.params.tweetId;

    data.tweets[retweet.id] = retweet;
  } else {
    tweet.retweetedBy = tweet.retweetedBy.filter(
      handle => handle !== CURRENT_USER_HANDLE
    );

    // HACK: finding the retweet is so so so not scalable.
    const retweet = Object.values(data.tweets).find(tweet => {
      return (
        tweet.retweetOf === req.params.tweetId &&
        tweet.authorHandle === CURRENT_USER_HANDLE
      );
    });

    delete data.tweets[retweet.id];
  }

  return res.json({ success: true });
});

module.exports = router;
