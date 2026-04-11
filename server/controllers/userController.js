import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 


const generateToken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIN:'7d'})
    return token;
}

// Controller for user registration
// Register User : /api/user/register
export const registerUser = async (req,res)=>{
    try{
        const{name,email,password} = req.body;
        // Check if required fields are present
        if(!name || !email || !password){
            return res.status(400).json({message: "Missing required Fields"})
        }

        // check if user already exists
        const existingUser = await User.findOne({email})
        if(existingUser)
            return res.json({success: false, message: "User already Exists."})

        // create new user
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({name, email,password: hashedPassword})

        const token = generateToken(user._id)
        newUser.password = undefined;
        
        return res.status(201).json({message: 'User created successfully', token, user: newUser})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({message: error.message});
    }
}

// Controller for user login
// login User : /api/user/login
export const loginUser = async (req,res)=>{
    try{
        // check if user exists
        const existingUser = await User.findOne({email})
        if(!existingUser)
            return res.json({success: false, message: "Invalid email or password."})

        // check if password is correct 
        if(!existingUser.comparePassword(password)){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // return success message
        const token = generateToken(existingUser._id)
        existingUser.password = undefined;
        
        return res.status(200).json({message: 'Login successful', token, existingUser})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({message: error.message});
    }
}


// Controller for getting user by id 
// GET : /api/users/data
export const getUserById = async (req,res)=>{
    try{
        const userId = req.userId;

        //check if user exist
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message:'User not found'})
        }

        // return user
        user.password = undefined;
        return res.status(200).json({user})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({message: error.message});
    }
}