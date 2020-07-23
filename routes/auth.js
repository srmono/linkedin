const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middlware/auth');

//@route GET api/auth
//@desc Tests users route
//@access Public
router.get('/', auth , async(req, res)  => {

    console.log(req.user)
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('SERVER ERROR')
    }
})

//@route POST api/auth login
//@desc Login 
//@access Public
router.post('/', [
    check('email', 'email id is require').isEmail(),
    check('password','pw is required').isLength({min:6})
], async (req,res) => {
    const errors = validationResult(req);
 
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }

    const {email, password} = req.body;
    console.log(req.body)
    try {
        console.log('try')
        let user = await User.findOne({email});
        console.log(user)
        if(!user){
            return res.status(400).json({ errors: [{msg: "User is not valid"}]})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ errors: [{msg: "password is not valid"}]})
        }
        console.log(isMatch);
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 60 * 60 },
            (err, token) => {
                if(err) throw err;
                res.json({token})
            }
        )
    } catch (error) {
        console.log(error.message)
        res.status(500).send('SERVER ERROR')
    }
})

module.exports = router;