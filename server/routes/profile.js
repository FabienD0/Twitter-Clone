/**
  Endpoints related to profile information and user details
*/
const lodash = require('lodash');
const router = require('express').Router();

const data = require('../data');

const {
  CURRENT_USER_HANDLE,
  getUser,
  getUserProfile,
  getTweetsFromUser,
  simulateProblems,
} = require('./routes.helpers.js');

router.get('/api/me/profile', (req, res) => {
  const profile = getUserProfile(CURRENT_USER_HANDLE);

  return simulateProblems(res, { profile });
});

router.get('/api/:handle/profile', (req, res) => {
  let profile;
  try {
    profile = getUserProfile(req.params.handle);
  } catch (err) {
    if (err.message === 'user-not-found') {
      return res.status(400).json({ error: 'user-not-found' });
    }
  }

  return res.json({
    profile,
  });
});

router.get('/api/:handle/following', (req, res) => {
  const user = getUser(req.params.handle);
  const following = user.followingIds.map(getUserProfile);

  return res.json({ following });
});
router.get('/api/:handle/followers', (req, res) => {
  const user = getUser(req.params.handle);
  const followers = user.followerIds.map(getUserProfile);

  return res.json({ followers });
});

router.put('/api/:handle/follow', (req, res) => {
  const user = getUser(req.params.handle);
  const currentUser = getUser(CURRENT_USER_HANDLE);

  if (user.followerIds.includes(CURRENT_USER_HANDLE)) {
    res.status(409).json({
      error: 'You are already following this user.',
    });
    return;
  }

  user.followerIds.push(CURRENT_USER_HANDLE);
  currentUser.followingIds.push(user.handle);

  res.json({ success: true });
  return;
});

router.put('/api/:handle/unfollow', (req, res) => {
  const user = getUser(req.params.handle);
  const currentUser = getUser(CURRENT_USER_HANDLE);

  if (!user.followerIds.includes(CURRENT_USER_HANDLE)) {
    res.status(409).json({
      error: 'You do not follow the user you are trying to unfollow.',
    });
    return;
  }

  const followerHandleIndex = user.followerIds.indexOf(CURRENT_USER_HANDLE);
  user.followerIds.splice(followerHandleIndex, 1);

  const followingHandleIndex = currentUser.followingIds.indexOf(user.handle);
  currentUser.followingIds.splice(followingHandleIndex, 1);

  res.json({ success: true });
  return;
});

module.exports = router;
