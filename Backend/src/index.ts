import express, { Request, Response } from "express";
import { random } from "./utils";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import cors from "cors";
import { z } from "zod";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());
app.use(cors());

const signupSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6)
});

app.post("/api/v1/signup", async (req, res) => {
    try {
        const parseResult = signupSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: "Invalid input", details: parseResult.error.errors });
        }
        const { username, password } = parseResult.data;
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: "Username already taken" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/v1/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await UserModel.findOne({ username });
        if (!existingUser) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        const token = jwt.sign({ id: existingUser._id }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const { link, type, title } = req.body;
        await ContentModel.create({
            link,
            type,
            title,
            userId: req.userId,
            tags: []
        });

        res.json({ message: "Content added" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const content = await ContentModel.find({ userId: userId }).populate("userId", "username");
        res.json(content);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const contentId = req.body.contentId;
        await ContentModel.deleteMany({ contentId, userId: req.userId });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    try {
        const { share } = req.body;
        if (share) {
            const existingLink = await LinkModel.findOne({ userId: req.userId });
            if (existingLink) {
                res.json({ hash: existingLink.hash });
                return;
            }
            const hash = random(10);
            await LinkModel.create({ userId: req.userId, hash });
            res.json({ hash });
        } else {
            await LinkModel.deleteOne({ userId: req.userId });
            res.json({ message: "Removed link" });
        }
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    try {
        const hash = req.params.shareLink;
        const link = await LinkModel.findOne({ hash });
        if (!link) {
            res.status(404).json({ message: "Invalid share link" });
            return;
        }
        const content = await ContentModel.find({ userId: link.userId });
        const user = await UserModel.findOne({ _id: link.userId });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({
            username: user.username,
            content
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
