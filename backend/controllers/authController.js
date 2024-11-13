import User from "../models/userModel.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
    const {username, email, password, displayName, privateAccount} = req.body;
    try {
        const userNameExists = await User.findOne({username});
        if (userNameExists) {
            return res.status(400).json({message: "Username already exists"});
        }
        const emailExists = await User.findOne({email});
        if (emailExists) {
            return res.status(400).json({message: "Email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            privateAccount: privateAccount || false
        });
        
        if (displayName) {
            newUser.displayName = displayName;
        }
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(200).json({
                _id: newUser._id,
                username: newUser.username, 
                email: newUser.email, 
                displayName: newUser.displayName || null,
                privateAccount: newUser.privateAccount,
                followers: newUser.followers, 
                following: newUser.following,
                blockedUsers: newUser.blockedUsers});
        } else {
            return res.status(400).json({message: "Invalid user data"});
        }
    }
    catch (error) {
        console.log("signup error", error.message);
        res.status(500).json({message: error.message});
    }
}

export const login = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if ((!username && !email) || !password) {
            return res.status(400).json({ message: "Invalid user data" });
        }

        let user = await User.findOne({ username });
        if (!user) {
            user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
        }

        console.log("username: ", username);

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log("logged in user:" + user.username);
            console.log(user._id);
            generateToken(user._id, res); 
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                displayName: user.displayName,
                followers: user.followers,
                following: user.following,
                blockedUsers: user.blockedUsers,
                privateAccount: user.privateAccount,
            });
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("login error", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        console.log('clear cookie');
        res.cookie("token", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    }
    catch (error) {
        console.log("logout error", error.message);
        res.status(500).json({message: error.message});
    }
}

export const currUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({user});
    }
    catch (error) {
        console.log("currUser error", error.message);
        res.status(500).json({message: error.message});
    }
}

export const updateUser = async (req, res) => {
    try {
        const {username, password, newPassword, email, displayName, privateAccount, bio} = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }
        if (password && newPassword) {
            if (await bcrypt.compare(password, user.password)) {
                const salt = await bcrypt.genSalt(10);
                const newHashedPassword = await bcrypt.hash(newPassword, salt);
                user.password = newHashedPassword;
            } else {
                return res.status(400).json({message: "Invalid password"});
            }
        }
        if (username) {
            if (await User.findOne({username})) {
                return res.status(400).json({message: "Username already exists"});
            } else {
                user.username = username;
            }
        }
        if (email) {
            if (await User.findOne({email})) {
                return res.status(400).json({message: "Email already exists"});
            } else {
                user.email = email;
            }
        }
        if (bio) {
            user.bio = bio;
        }
        if (displayName) {
            user.displayName = displayName;
        }
        if (privateAccount) {
            user.privateAccount = privateAccount;
        }
        await user.save();
        res.status(200).json({
            _id: user._id,
            username: user.username, 
            email: user.email, 
            displayName: user.displayName, 
            privateAccount: user.privateAccount,
            followers: user.followers, 
            following: user.following,
            blockedUsers: user.blockedUsers
        });
    }
    catch (error) {
        console.log("updateUser error", error.message);
        res.status(500).json({message: error.message});
    }
}