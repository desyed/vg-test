const { EXPO_PUBLIC_AWS_BUCKET } = process.env;
export const createS3Url = (key) =>
  `https://${EXPO_PUBLIC_AWS_BUCKET}.s3.amazonaws.com/${key}`;
