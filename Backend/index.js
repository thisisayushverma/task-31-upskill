import express from "express"
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"
import cors from "cors"

dotenv.config({
    path: ".env"
});


const app = express();
const users = new Map();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false
        })
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_TOKEN);

        if (users.get(payload.id).email !== payload.email) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }
        req.user = {
            id: payload.id,
            email: payload.email,
            name: users.get(payload.id).name
        };
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "unable to verify token",
            success: false
        })
    }


}


app.post("/signup", async (req, res) => {
    console.log(req.body);
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            message: "Incomplete Credentials",
            success: false
        })
    }

    users.forEach((value, key) => {
        if (value.email === email) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            })
        }
    })

    const id = uuidv4();
    users.set(id, { email, password, name });
    const token = jwt.sign({ id, email }, process.env.SECRET_TOKEN);
    res.setHeader("Authorization", token);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    console.log("token", token);
    return res.status(201).json({
        message: "User created",
        success: true
    })
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Incomplete Credentials",
            success: false
        })
    }

    let isUserPresent = false;
    let userId;
    users.forEach((value, key) => {
        if (value.email === email && value.password === password) {
            isUserPresent = true
            userId = key;
        }
    })



    if (isUserPresent === false) {
        return res.status(400).json({
            message: "User not found",
            success: false
        })
    }

    console.log("user", userId, users.get(userId));
    const token = jwt.sign({ id: userId, email: users.get(userId).email }, process.env.SECRET_TOKEN);
    res.setHeader("Authorization", token);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    return res.status(200).json({
        message: "User logged in",
        success: true
    })
})


app.post("/home", authMiddleware, async (req, res) => {
    return res.status(200).json({
        message: "User logged in",
        success: true,
        user: req.user
    })
})





app.listen(4000, () => {
    console.log("server started", 4000);
})