const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation/validation');


/** User Registration */
router.post('/register', async (req, res) => {
    /** Validate data before registering the user */
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send({error: error.details[0].message});

    /** Check if the user already exists */
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send({message: `Email already exist.`});

    /** Hash the password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    /** Create the user */
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const newUser = await user.save();
        res.status(200).json({message: `User created successfully.`});
    }catch(err){
        res.status(400).send({error: err});
    }
});

/** User Login */
router.post('/login', async (req, res) => {
    /** Validate data before loggin the user */
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send({error: error.details[0].message});

    /** Check if the user is already exists */
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({message: `Email not found. Please register.`});

    /** Check if password is correct */
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send({error: `Invalid password.`});

    /** Create a JWT token and assign to user */
    const token = jwt.sign({_id: user._id, userName: user.name, email: user.email}, process.env.TOKEN_SECRET);
    res.header('Authorization', token).send({message: `Logged in successfuly.`, authToken: token});
});

module.exports = router;