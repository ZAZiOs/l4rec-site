import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
id: String,
title: String,
thumbnail: String,
orig_name: String,
progress_color: String,
archived: Boolean,
public: Boolean,
roles: Object,
episode_list: Object
})

export const ProjectDB = mongoose.models.project ?? mongoose.model("project", projectSchema)