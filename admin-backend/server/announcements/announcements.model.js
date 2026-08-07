const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, _id: false }
);

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String },

    media: [{ type: String }],

    type: {
      type: String,
      enum: ["text", "image", "video", "svga", "competition"],
      required: true,
    },

    sendNow: { type: Boolean, default: true },
    sended: { type: Boolean, default: false },
    scheduledTime: { type: Date },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Announcement", announcementSchema);