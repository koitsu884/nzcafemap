const Joi = require('joi');
const bcrypt = require('bcrypt');
const config = require('config');
const _ = require('lodash');
const {User} = require('../models/user');
const express = require('express');
const passport = require('passport');
const router = express.Router();

function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }

router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = await User.findById(req.user._id);
    res.send(user);
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('メールアドレスかパスワードが間違っています');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('メールアドレスかパスワードが間違っています');

  const token = user.generateAuthToken();
  // let returnUser = user.toObject();
  res.header('x-auth-token', token).send(user);
});

router.get('/twitter', 
  passport.authenticate('twitter'))

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: config.get('clientUrl') }),
  async (req, res) => {
    const token = req.user.generateAuthToken();  
    res.redirect(config.get('clientUrl') + 'oauth/' + token);
  }
)

module.exports = router; 
