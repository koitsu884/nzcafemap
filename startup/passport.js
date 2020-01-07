const JwtStrategy = require('passport-jwt').Strategy;
const config = require('config');

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
}