import bcrypt from 'bcrypt';
import User from '../Models/User.js';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {

        const newUser = new User({
            username,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully!"
        });
    } catch (error) {
        console.log(error);
         
         if (error.name === 'ValidationError') {

            const messages = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ errors: messages });
        } else if (error.code === 11000) {
            
            const field = Object.keys(error.keyValue)[0]; 
            const value = error.keyValue[field]; 
            res.status(400).json({ errors: [`${field} "${value}" already exists`] });
        } else {
           
            console.error('Server error:', error);
            res.status(500).json({ message: "Failed to create user!" });
        }
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username }).populate('savedPosts');

        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }
        const isPassValid = await bcrypt.compare(password, user.password);

        if (!isPassValid) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        const cookieExp = 1000 * 60 * 60 * 24 * 7;


        const token = jwt.sign({
            id: user._id,
            isAdmin: true,
        }, process.env.JWT_SECRET_KEY, { expiresIn: cookieExp });

        const { password: userPassword, ...userInfo } = user.toObject();

        
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: cookieExp,
        }).status(200).json(userInfo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to login!" });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token').status(200).json({ message: "Logout Successful!" });
};