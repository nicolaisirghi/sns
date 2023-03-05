export const saveFile = (file) => {
  const bucketName = process.env.GOOGLE_BUCKET_NAME;
  const bucket = googleStorage.bucket(bucketName);
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });
  blobStream.on("error", (err) => {
    console.error("Error uploading file:", err);
  });

  blobStream.end(file.buffer);

  return `https://storage.cloud.google.com/${bucketName}/${blob.name}`;
};
