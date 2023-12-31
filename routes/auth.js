const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const Company = require('../models/company');
const Influencer = require('../models/influencer');
const Campaign = require('../models/campaign');
const { isLoggedIn } = require('../helpers/middleware');

router.get('/me', (req, res, next) => {
  console.log('me', req.session.currentUser);
  if (req.session.currentUser) {
    res.json(req.session.currentUser);
  } else {
    res.status(404).json({ error: 'not-found' });
  }
});

router.post('/login/company', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: 'validation' });
  }

  Company.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'not-found' });
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.json(user);
      }
      return res.status(404).json({ error: 'not-found' });
    })
    .catch(next);
});

router.post('/login/influencer', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: 'validation' });
  }

  Influencer.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'not-found' });
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.json(user);
      }
      return res.status(404).json({ error: 'not-found' });
    })
    .catch(next);
});

router.post('/brand/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(422).json({ error: 'validation' });
  }

  Company.findOne({ username }, 'username')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({ error: 'username-not-unique' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = Company({
        username,
        email,
        password: hashPass,
      });

      return newUser.save().then(() => {
        req.session.currentUser = newUser;
        res.json(newUser);
      });
    })
    .catch(next);
});

router.post('/influencer/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(422).res.json({ error: 'unauthorized' });
  }

  Influencer.findOne({ username }, 'username')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({ error: 'username-not-unique' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = Influencer({
        username,
        email,
        password: hashPass,
      });

      return newUser.save().then(() => {
        req.session.currentUser = newUser;
        res.json(newUser);
      });
    })
    .catch(next);
});

router.post('/logout', (req, res) => {
  req.session.currentUser = null;
  return res.status(204).send();
});

router.get('/private', isLoggedIn(), (req, res, next) => {
  res.status(200).json({ message: 'This is a private message' });
});

module.exports = router;
