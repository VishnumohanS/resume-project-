const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

// REGISTER USER
const register = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("User already exists");
    }

    const createUser = await User.create({
        name,
        email,
        password
    });

    res.json({
        name: createUser.name,
        email: createUser.email,
        token: generateToken(createUser._id)
    });

});

// LOGIN USER
const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    const findUser = await User.findOne({ email });

    if (findUser && (await findUser.matchPassword(password))) {

        res.json({
            name: findUser.name,
            email: findUser.email,
            token: generateToken(findUser._id)
        });

    } else {

        res.status(400);
        throw new Error("Invalid email or password");

    }

});

module.exports = {
    register,
    login
};