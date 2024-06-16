import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
login: String,
username: String,
discord: String,
pass: String,
accepted: Boolean,
roles: Array,
curating: Array,
token_check: String,
})

export const UserDB = mongoose.models.user ?? mongoose.model("user", userSchema)