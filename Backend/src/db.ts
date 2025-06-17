import mongoose, { model, Schema } from "mongoose";
mongoose.connect("mongodb+srv://raunitjaiswal510:bX2q9WOPXTjTR8bi@cluster0.i6xb0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
//TODO move to .env file

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String, unique: true }
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,                         
    Link: String,                          
    tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }],
    userId: [{ 
        type: mongoose.Types.ObjectId, 
        ref: "User", 
        required: true                      
    }],
});


export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
});

export const LinkModel = model("Links", LinkSchema);