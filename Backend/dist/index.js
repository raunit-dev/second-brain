"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6)
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parseResult = signupSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: "Invalid input", details: parseResult.error.errors });
        }
        const { username, password } = parseResult.data;
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: "Username already taken" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new db_1.UserModel({ username, password: hashedPassword });
        yield user.save();
        res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (!existingUser) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }
        if (!existingUser.password) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, config_1.JWT_SECRET);
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, type, title } = req.body;
        yield db_1.ContentModel.create({
            link,
            type,
            title,
            userId: req.userId,
            tags: []
        });
        res.json({ message: "Content added" });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const content = yield db_1.ContentModel.find({ userId: userId }).populate("userId", "username");
        res.json(content);
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentId = req.body.contentId;
        yield db_1.ContentModel.deleteMany({ contentId, userId: req.userId });
        res.json({ message: "Deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { share } = req.body;
        if (share) {
            const existingLink = yield db_1.LinkModel.findOne({ userId: req.userId });
            if (existingLink) {
                res.json({ hash: existingLink.hash });
                return;
            }
            const hash = (0, utils_1.random)(10);
            yield db_1.LinkModel.create({ userId: req.userId, hash });
            res.json({ hash });
        }
        else {
            yield db_1.LinkModel.deleteOne({ userId: req.userId });
            res.json({ message: "Removed link" });
        }
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.shareLink;
        const link = yield db_1.LinkModel.findOne({ hash });
        if (!link) {
            res.status(404).json({ message: "Invalid share link" });
            return;
        }
        const content = yield db_1.ContentModel.find({ userId: link.userId });
        const user = yield db_1.UserModel.findOne({ _id: link.userId });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({
            username: user.username,
            content
        });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.listen(3000, () => {
    console.log("🚀 Connected to backend on http://localhost:3000");
});
