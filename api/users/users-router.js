const express = require('express');
const Users = require('./users-model');
const Posts = require('../posts/posts-model');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await Users.get()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: "something went wrong" })
  }
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.post('/', validateUser, async (req, res) => {
  try {
    const newUser = await Users.insert(req.body);
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({ message: "something went wrong" })
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  try {
    const updatedUser = await Users.update(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" })
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const user = await Users.getById(req.params.id)
    const deletedUser = await Users.remove(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" })
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    const userPosts = await Users.getUserPosts(req.params.id);
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" })
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  try {
    const newPost = await Posts.insert({user_id: req.params.id, text: req.body.text});
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" })
  }
});

// do not forget to export the router
module.exports = router; 