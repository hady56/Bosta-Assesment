const { JsonWebTokenError } = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./Models/user.js')
const JwtStrategy=require('passport-jwt').Strategy
const ExtractJwt=require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
require("dotenv").config()

const secretKey=process.env.secretKey

exports.local= passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user,expireTime) {
   // console.log(user)
    return jwt.sign(user, secretKey,
        {expiresIn: expireTime});
};

exports.verifyToken=function(token){
   return jwt.verify(token, secretKey, (err, verifiedToken) => {
        if(err){
          return "error"
        }else{
          return verifiedToken
        }
      })
}

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        User.findOne({email: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});
