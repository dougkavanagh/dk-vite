import AWS from "aws-sdk";
import {
  APP_AWS_REGION,
  APP_AWS_S3_ACCESS_KEY,
  APP_AWS_S3_SECRET_KEY,
  APP_AWS_S3_BUCKET,
} from "../core/env";
import { DbFile, FileModel } from "./file-model";
import { id } from "../core/core-model";

// https://www.netlify.com/blog/2016/11/17/serverless-file-uploads/
// https://objectivefs.com/howto/how-to-restrict-s3-bucket-policy-to-only-one-aws-s3-bucket
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property

export type FileAccessInfo = {
  putUrl?: string;
  getUrl?: string;
  file: DbFile;
};

export async function insertNewFile(newFile: DbFile): Promise<DbFile> {
  return await FileModel.create(newFile);
}

export async function getFile(id: string): Promise<DbFile | null> {
  return await FileModel.findById(id);
}

export function prepareFileUpload(file: DbFile): FileAccessInfo {
  const s3 = new AWS.S3({
    accessKeyId: APP_AWS_S3_ACCESS_KEY,
    secretAccessKey: APP_AWS_S3_SECRET_KEY,
    region: APP_AWS_REGION,
  });

  // https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html
  const putParams = {
    Bucket: APP_AWS_S3_BUCKET,
    Key: file._id,
    Expires: 2 * 60, // valid for 2 minutes
    ContentType: file.mimeType,
  };

  return {
    putUrl: s3.getSignedUrl("putObject", putParams),
    file: file,
  };
}

export function prepareFileDownload(file: DbFile) {
  const s3 = new AWS.S3({
    accessKeyId: APP_AWS_S3_ACCESS_KEY,
    secretAccessKey: APP_AWS_S3_SECRET_KEY,
    region: APP_AWS_REGION,
  });
  const getParams = {
    Bucket: APP_AWS_S3_BUCKET,
    Key: file._id,
    Expires: 60 * 60, // 60-minutes
    ResponseCacheControl: "max-age=604800",
  };
  return {
    getUrl: s3.getSignedUrl("getObject", getParams),
    file: file,
  };
}

export async function insertNewFileForUpload(
  newFile: Omit<DbFile, "_id">
): Promise<FileAccessInfo> {
  const file = await insertNewFile({
    _id: id(),
    ...newFile,
  });
  return prepareFileUpload(file);
}
