const router = require('express').Router();

const googleLogin = require('./googleLogin');
const googleSignUp = require('./googleSignup');

router.use('/google', googleLogin, googleSignUp)

module.exports= router;