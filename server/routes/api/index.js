const router = require('express').Router();


const googleRoutes = require('./googleRoutes')

router.use('/api', googleRoutes)


module.exports = router;