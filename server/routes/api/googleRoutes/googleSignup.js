const router = require('express').Router()
const {OAuth2Client} = require('google-auth-library');


const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

router.post('/signup', (req, res)=>{
  const { token } = req.body;
  async function verify(){
    try{
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      res.status(200).json(payload)
    }catch(err){
      console.log(err)
      res.status(401).json(err)
    }
  }
  verify().catch(console.error);
})

module.exports = router;