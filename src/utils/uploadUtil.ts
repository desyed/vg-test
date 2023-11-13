import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat, ImageResult } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import uuid from 'react-native-uuid';

import { createS3Url } from './awsUtil';
import { callGetSignecdUrlDirectly } from "../services/awsApi";


function getBaseUrl(url) {
  // Find the index of the '?' character
  const queryIndex = url.indexOf('?');

  // If there is no query string, return the original URL
  if (queryIndex === -1) return url;

  // Return the substring from the start to the '?' character
  return url.substring(0, queryIndex);
}
export const createUploadTask = async ({
  uri,
  acl,
  onProgress,
  key,
  filename
}) => {
  const mimeType = mime.getType(uri);

  const result = await callGetSignecdUrlDirectly({
    key,
    contentType: mimeType,
    acl
  });

  console.log('result', result);
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

    return { task, key, filename, mimeType, url: getBaseUrl(result?.data?.url) };
  }

  return null;
};

export const createMediaUploadTask = async ({
  uri,
  getSignedPutUrl,
  acl,
  onProgress
}) => {
  const mimeType = mime.getType(uri);
  const ext = mime.getExtension(mimeType);
  const id = uuid.v4();
  const filename = `${id}.${ext}`;

  return createUploadTask({
    uri,
    getSignedPutUrl,
    acl,
    onProgress,
    key: `videogift/media/${filename}`,
    filename
  });
};

export const pickImage = async (): Promise<ImageResult> => {
  // setImageLoading(true)
  // No permissions request is necessary for launching the image library
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    base64: true,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1
  });

  if (!result.canceled) {
    const imageResized = await manipulateAsync(
      result?.assets[0].uri,
      [{ resize: { height: 100, width: 100 } }],
      { compress: 1, format: SaveFormat.PNG }
    );

    return imageResized;
  }
};
