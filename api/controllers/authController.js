import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import Creator from "../models/creatorModel.js";
import Editor from "../models/editorModel.js";

export const login = async (req, res) => {
    const { email, password, role } = req.body;
    if (!role) {
        return res.status(401).json({
            success: false,
            message: "role not found",
        })
    }
    const Model = role === "editor" ? Editor : Creator;
    try {

        const validUser = await Model.findOne({ email });
        if (!validUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Password Incorrect",
            })
        }

        const payload = {
            email: validUser.email,
            role: validUser.role,
            id: validUser._id,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        console.log(token);

        const options = {
            httpOnly: true,       // Ensures the cookie works for navigation within the same site
        };


        res.cookie("accessToken", token, options).status(200).json({
            success: true,
            user: rest,
            token: token,
            message: "user logged in"
        });

    }
    catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({
            success: false,
            message: "login fail"
        })

    }
}

export const loginWithGoogle = async (req, res) => {
    
    const {fullName, email, role } = req.body;
    console.log(req.body);
    if (!role) {
        return res.status(401).json({
            success: false,
            message: "role not found",
        })
    }

    const Model = role === "editor" ? Editor : Creator;

    try {

        const user = await Model.findOne({ email });
        if (user) {
            const payload = {
                email: user.email,
                role: user.role,
                id: user._id,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;

            const options = {
                httpOnly: true,
            };

            res.cookie("accessToken", token, options).status(200).json({
                success: true,
                user: rest,
                token: token,
                message: "user logged in with google"
            });

        }
        else{

            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 7);

            const newUser = new Model({
                name: fullName,
                username: fullName.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email,
                password: hashedPassword,
                role: role,
            })
    
            await newUser.save();
            console.log("User created Successfully - google")
    
            res.status(201).json({
                success: true,
                message: "user created succesfully with google"
            })

        }

    }
    catch (error) {
        console.error("Error during login with google:", error.message);
        return res.status(500).json({
            success: false,
            message: "login fail"
        })

    }


}


export const signup = async (req, res) => {

    const { fullName, email, password, role } = req.body
    if (!role) {
        return res.status(401).json({
            success: false,
            message: "role not found",
        })
    }
    const Model = role === "editor" ? Editor : Creator;

    try {

        const existingUser = await Model.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already in use",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 7);
        const newUser = new Model({
            name: fullName,
            username: fullName.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
            email,
            password: hashedPassword,
            role: role,
        })

        await newUser.save();
        console.log("User created Successfully - authController,signup")

        res.status(201).json({
            success: true,
            message: "user created succesfully"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Signup fail",
        });
    }

};


export const logout = async (req, res) => {
    console.log("hi");
    
    try{
        console.log("abc", req.cookies.accessToken);
        res.clearCookie('accessToken');
        res.status(200).json('User has been logged out!');
    }
    catch(e){
        console.log("eror");
        
    }
}