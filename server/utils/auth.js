const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
  
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
  
    if (!token) {
      return { token: null }; // return context with token set to null if no token is provided
    }
  
    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log('Decoded token data:', data); // Add this line
      req.user = data;
    } catch {
      console.log('Invalid token');
      return { user: null }; // return context with token set to null if token is invalid
    }
  
    // send to next endpoint
    console.log('req.user:', req.user); // Add this line
    return { token, user:req.user }; // return context with token
  },
  signToken: function ({ email, name, _id }) {
    const payload = { email, name, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  decodeToken: function (token) {
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      return data._id;
    } catch (error) {
      console.error('Token error:', error.message, 'Token:', token); // Log the error message and token for debugging
      throw new Error(`Invalid token: ${error.message}`);
    }
  },
};
