import { model, Schema } from "mongoose";

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Author",
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tag",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },

});

const Post = model("Post", postSchema);

export default Post;