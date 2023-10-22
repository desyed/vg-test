import * as FileSystem from 'expo-file-system';
import mime from 'mime';
import uuid from 'react-native-uuid';

import { createS3Url } from './awsUtil';

export const createMediaUploadTask = async ({
  uri,
  getSignedPutUrl,
  acl,
  onProgress
}) => {
  console.info('uploading', uri);
  const mimeType = mime.getType(uri);
  const ext = mime.getExtension(mimeType);
  const id = uuid.v4();
  const filename = `${id}.${ext}`;
  const key = `videogift/media/${filename}`;
  const result = await getSignedPutUrl({
    key,
    contentType: mimeType,
    acl
  });
  if (result?.data) {
    const task = FileSystem.createUploadTask(
      result?.data?.url,
      uri,
      {
        httpMethod: 'PUT',
        fieldName: 'file',
        sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT
      },
      onProgress
    );

    return { task, key, filename, mimeType, url: createS3Url(key) };
  }

  return null;
};
