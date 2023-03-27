export const fileValidatorMiddleware = (req, file, next) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/mpeg" ||
    file.mimetype === "video/x-matroska" ||
    file.mimetype === "video/webm"
  ) {
    next(null, true);
  } else {
    next(null, false);
    return next(new Error("Only images and video allowed!"));
  }
};
