const express = require('express');
const router = express.Router();

// @route      GET api/users/test
// @desc:      Test 
// @access     Public
router.get('/test', (req,res) => {
    res.json({msg: "Profile API Works"})
})

module.exports = router;