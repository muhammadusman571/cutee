const fs = require("fs");
const Announcement = require("./announcements.model");
const { deleteFiles, deleteFile } = require("../../util/deleteFile");

// Get all announcements
exports.index = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });

    if (!announcements.length) {
      return res
        .status(200)
        .json({
          status: false,
          message: "No announcements found!",
          data: announcements,
        });
    }
    res
      .status(200)
      .json({ status: true, message: "Success", data: announcements });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Get single announcement
exports.show = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res
        .status(404)
        .json({ status: false, message: "Announcement not found" });
    }
    res.status(200).json({ status: true, data: announcement });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Create announcement
exports.store = async (req, res) => {
  try {
    const { title, text, type, sendNow, scheduledTime } = req.body;

    if (!title || !type) {
      return res
        .status(400)
        .json({ status: false, message: "Title and type are required" });
    }

    const media = req.files?.map((f) => f.path) || [];

    const announcement = await Announcement.create({
      title,
      text,
      type,
      sendNow: sendNow ?? true,
      scheduledTime: scheduledTime || null,
      media,
    });
    if (announcement.sendNow) {
      announcement.sended = true;
      const sockets = await io.in("globalAnnouncements").fetchSockets();

      if (sockets?.length) {
        io.to("globalAnnouncements").emit("announcement:new", announcement);
        console.log("Announcement sent to all users");
      } else {
        console.log("No users connected");
      }
    }
    await announcement.save();

    res
      .status(201)
      .json({
        status: true,
        message: "Announcement created",
        announcement: announcement,
      });
  } catch (error) {
    console.error(error);
    deleteFiles(req.files);
    res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Update announcement
exports.update = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.announcementId);
    if (!announcement) {
      deleteFiles(req.files);
      return res
        .status(404)
        .json({ status: false, message: "Announcement not found" });
    }

    const { title, text, type, sendNow, scheduledTime } = req.body;
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map((f) => f.path);
      announcement.media = [...announcement.media, ...newMedia];
    }

    announcement.title = title ?? announcement.title;
    announcement.text = text ?? announcement.text;
    announcement.type = type ?? announcement.type;
    announcement.sendNow = sendNow ?? announcement.sendNow;
    announcement.scheduledTime = scheduledTime ?? announcement.scheduledTime;

    if (announcement.sendNow) {
      announcement.sended = true;

      const sockets = await io.in("globalAnnouncements").fetchSockets();

      if (sockets?.length) {
        io.to("globalAnnouncements").emit("announcement:new", announcement);
        console.log("Announcement sent to all users");
      } else {
        console.log("No users connected");
      }
    }
    await announcement.save();
    res
      .status(200)
      .json({
        status: true,
        message: "Announcement updated",
        announcement: announcement,
      });
  } catch (error) {
    console.error(error);
    deleteFiles(req.files);
    res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Delete announcement
exports.destroy = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.announcementId);
    if (!announcement) {
      return res
        .status(404)
        .json({ status: false, message: "Announcement not found" });
    }

    // Delete media files from server
    if (announcement.media && announcement.media.length > 0) {
      announcement.media.forEach((filePath) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    await announcement.deleteOne();

    res
      .status(200)
      .json({ status: true, message: "Announcement deleted", announcement });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
