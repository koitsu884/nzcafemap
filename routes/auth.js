const Joi = require('joi');
const bcrypt = require('bcrypt');
const config = require('config');
const _ = require('lodash');
const {User} = require('../models/user');
const {Token, TOKEN_TYPE_PASSWORD, TOKEN_TYPE_VERIFY} = require('../models/token');
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
    res.send(req.user);
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user) return res.status(400).send('メールアドレスかパスワードが間違っています');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('メールアドレスかパスワードが間違っています');

  const token = user.generateAuthToken();
  // let returnUser = user.toObject();
  res.header('x-auth-token', token).send(user);
});

router.get('/verify', async (req, res) => {
  let token = req.query.token;
  if (!token) return res.status(400).send('No token provided');

  try {
    let tokenObj = await Token.findOne({ token: token, type: TOKEN_TYPE_VERIFY });
    if (!tokenObj)
      return res.status(404).send('リンクが無効です');

    let user = await User.findById(tokenObj._userId);
    if (!user)
      return res.status(404).send('ユーザー情報が見つかりません');
    if( user.verified)
      return res.status(400).send('そのメールアドレスは既に認証済みです');

    user.verified = true;
    await user.save();
    await Token.deleteOne(tokenObj);

    const accessToken = user.generateAuthToken();
    res.header('x-auth-token', accessToken).send(user);
  }
  catch (error) {
    res.status(500).send('Email verification failed');
  }
})

router.post('/forgotpassword', async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("そのメールアドレスは登録されていません");
  }

  await user.sendPasswordResetEmail();
  res.status(200).send(user);
})

router.post('/resetpassword', async (req, res) => {
  let token = req.query.token;
  if (!token) return res.status(400).send('No token provided');

  try {
    let tokenObj = await Token.findOne({ token: token, type: TOKEN_TYPE_PASSWORD });
    if (!tokenObj)
      return res.status(404).send('リンクが無効です');

    let user = await User.findById(tokenObj._userId);
    if (!user)
      return res.status(404).send('ユーザーが見つかりません');
    
    user.password = req.body.password;
    await user.save();
    await Token.deleteOne(tokenObj);
    res.send('OK');
  }
  catch (error) {
    console.log(error);
    res.status(500).send('Password reset failed');
  }
})

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
