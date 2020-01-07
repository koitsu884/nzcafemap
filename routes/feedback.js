const express = require('express');
const passport = require('passport');
const router = express.Router();

const { Feedback, validate } = require('../models/feedback');
const { User } = require('../models/user');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user.isAdmin)
        return res.status(401).send('閲覧権限がありません');

    const feedBacks = await Feedback.find();

    res.send(feedBacks);
})

router.post('/', async (req, res) => {
    let data = Object.assign({}, req.body);

    const { error } = validate(data);
    if (error) return res.status(400).send(error.details[0].message);

    let feedBack = new Feedback(data);
    await feedBack.save();
    res.send(feedBack);
})

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user.isAdmin)
        return res.status(401).send('閲覧権限がありません');

    const feedBack = await Feedback.findById(req.params.id);

    feedBack.remove();

    res.send(feedBack);
})

module.exports = router;