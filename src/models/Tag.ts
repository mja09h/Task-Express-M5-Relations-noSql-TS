import { model, Schema } from "mongoose";

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post",
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

const Tag = model("Tag", tagSchema);

export default Tag;