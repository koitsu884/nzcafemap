const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('メールアドレスかパスワードが間違っています');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('メールアドレスかパスワードが間違っています');

  const token = user.generateAuthToken();
  // let returnUser = user.toObject();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'isAdmin', 'isDisabled', 'displayName', 'photo']));
});

module.exports = router; 
