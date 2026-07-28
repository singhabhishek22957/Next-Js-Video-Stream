import { S3Client } from "@aws-sdk/client-s3";



export const bunny = new S3Client({
  region: process.env.BUNNY_REGION as string, // "SG"
  endpoint: process.env.BUNNY_ENDPOINT_S3 as string, // "https://sg.storage.bunnycdn.com"
  credentials: {
    accessKeyId: process.env.BUNNY_BUCKET_S3 as string, // "steamflix-storage" — the storage zone name acts as the access key ID
    secretAccessKey: process.env.BUNNY_ACCESS_KEY_S3 as string, // the password/AccessKey — rotate this
  },
  forcePathStyle: true,
  
});