const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");

const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) error = null;

    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.get("", postController.getPosts);
router.post(
  "",
  multer({ storage: storage }).single("image"),
  postController.createPost
);
router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  postController.updatePost
);
router.get("/:id", postController.getPost);
router.delete("/:id", postController.deletePost);

module.exports = router;
