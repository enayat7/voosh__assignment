
import passport from 'passport';
// const LocalStrategy = require('passport-local').Strategy;
import LocalStrategy from 'passport-local';
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
import GoogleStrategy from 'passport-google-oauth20';
// const User = require('../models/user.model');
import { User } from '../models/user.model.js';

import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: 'User not found' });
    const isMatch = await  bcrypt.compare(password, user.password)
    if (!isMatch) return done(null, false, { message: 'Incorrect password' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
    user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        photo: profile.photos[0].value
      });
    }
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
