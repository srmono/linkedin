const express = require('express');
const router = express.Router();
const User = require('../models/User');
const gravatar = require('gravatar');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

// @route      GET api/users/test
// @desc:      Test 
// @access     Public

router.post('/',[
    check('name', "Name is must").not().isEmpty(),
    check('email', "Email is required").isEmail(),
    check('password', "possword min length to be 6 characters").isLength({min: 6})
], async (req,res) => {
    const errors = validationResult(req);
 
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }

    const { name, email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({ errors: [{msg: "User Already Exists"}]})
        }

        //Get Avatar
        const avatar = gravatar.url(email,{
            s: "200",
            r: "pg",
            d: "mm"
        })

        //Define Object
        user = new User({
            name,
            email,
            avatar,
            password
        })

        //bcrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt)

        //save
        await user.save()
        
        

    } catch (error) {
        console.log(error.message);
        res.status(500).send('SERVER ERROR')
    }

    res.send("user is running successfully")
})

module.exports = router;








