const JwtStrategy = require('passport-jwt').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const config = require('config');
const { User } = require('../models/user');

/*================================================
Twitter Oauth
==================================================*/
const setupTwitterStrategy = passport => {
    // let twitterCallbackURL = config.get('clientUrl') + 'auth/twitter/callback';
    let twitterCallbackURL = process.env.NODE_ENV === 'production'
                ? 'https://www.nzcafemap.com/api/auth/twitter/callback'
                : 'http://127.0.0.1:5000/api/auth/twitter/callback';

    const tsOpts = {
        consumerKey: config.get('twitterConsumerKey'),
        consumerSecret: config.get('twitterConsumerSecret'),
        callbackURL: twitterCallbackURL
    };
    // console.log(goaOpts);
    passport.use(new TwitterStrategy(tsOpts, async (accessToken, tokenSecret, profile, done) => {
        let twitterProfile = {
            userName: profile.username,
            displayName: profile.displayName,
            url: profile._json.url,
            imageUrl: profile._json.profile_image_url_https
        }

        let user = await User.findOne({twitterId: profile.id});

        if(!user){
            user = new User({
                twitterId: profile.id,
                displayName:twitterProfile.displayName,
            });
            await user.save();
        }

        user.twitterProfile = twitterProfile;
        await user.save();
        return done(null, user); 
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}


/*================================================
 JWT
==================================================*/
const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = req => {
    if( req && req.header('x-auth-token')){
        return req.header('x-auth-token');
    }

    return null;
};
opts.secretOrKey = config.get('jwtPrivateKey');

const setupJwtStrategy = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        if (Date.now() > jwt_payload.expires) {
            return done('jwt expired');
        }

        return done(null, jwt_payload);
    }));
}


module.exports = passport => {
    setupJwtStrategy(passport);
    setupTwitterStrategy(passport);
}