export const getFileType = (file) => {
  let type;
  switch (file.mimetype) {
    case "image/jpeg":
    case "image/jpg":
    case "image/png":
    case "image/gif":
      type = "image";
      break;
    case "video/mp4":
    case "video/mpeg":
    case "video/webm":
    case "video/avi":
      type = "video";
      break;
    case "audio/mp3":
    case "audio/wav":
    case "audio/ogg":
    case "audio/flac":
    default:
      type = "document";
  }
  return type;
};
