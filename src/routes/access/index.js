const express = require('express');
const accessControllers = require('../../controller/access.controllers');
const router = express.Router();


// sign up

router.post('/shop/signup', accessControllers.signup)


module.exports =router;