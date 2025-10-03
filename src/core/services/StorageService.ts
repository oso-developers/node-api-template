import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { storageConfig } from "@/app/config/storageConfig"
import { logger } from "@/core/server/logger"
import { isTest } from "@/core/helpers"
import { AuthException, BadRequestException } from "@/core/entities/exceptions"

export const StorageService = {
  client: new S3Client({
    region: storageConfig.region,
  }),

  /**
   * upload a file to S3 bucket, if the upload fails, this function can throw
   *
   */
  
  async upload(
    filename: string,
    fileData: Buffer,
  ): Promise<string | undefined> {
    if (isTest()) {
      return "FAKE-" + this.calculatePublicURL(filename)
    }

    const command = new PutObjectCommand({
      Bucket: storageConfig.bucketName,
      Key: filename,
      Body: fileData,
    })

    const res = await this.client.send(command).catch((error: any) => {
      logger.error({ error }, "failed to upload file")
    })

    if (!res) return
    if (res.$metadata.httpStatusCode !== 200) {
      return
    }

    return this.calculatePublicURL(filename)
  },

  /**
   * upload file to S3 bucket in base64 format
   *
   */
  async uploadBase64(
    filename: string,
    encoding: string,
  ): Promise<string | undefined> {
    const buffer = this.encodingToBuffer(encoding)
    if (isTest()) {
      return "FAKE-" + this.calculatePublicURL(filename)
    }

    const command = new PutObjectCommand({
      Bucket: storageConfig.bucketName,
      Key: filename,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: this.extractMimeType(encoding),
    })

    const res = await this.client.send(command).catch((error: any) => {
      logger.error({ error }, "failed to upload file")
    })

    if (!res) return
    if (res.$metadata.httpStatusCode !== 200) {
      return
    }

    return this.calculatePublicURL(filename)
  },

  /**
   * the full URL for uploaded file can be easily determined
   * the above upload mechanism doesn't return the public location for the
   * file so we calculate it locally
   */
  calculatePublicURL(filename: string) {
    const { bucketName, region } = storageConfig
    return `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`
  },

  /**
   * extract mimetype from the provided base64 encoding
   *
   */
  extractMimeType(encoding: string): string {
    /* matches[1] should be image/jpg etc. */
    const matches = /data:(.*);/g.exec(encoding)
    if (!matches || !matches[1]) {
      throw BadRequestException("invalid base64 encoding")
    }
    return matches[1]
  },

  /**
   * convert base64 encoding into binary buffer
   *
   */
  encodingToBuffer(encoding: string): Buffer {
    /* extract the raw encoding i.e. part after data:image/png; */
    const raw = encoding.split(",")
    if (!raw[1]) {
      throw BadRequestException("invalid base64 encoding")
    }
    /* convert raw encoding to binary data */
    return Buffer.from(raw[1], "base64")
  },

  /**
   * remove a file from S3 storage bucket
   *
   */
  async delete(filename: string): Promise<boolean> {
    if (isTest()) {
      return true
    }

    const command = new DeleteObjectCommand({
      Bucket: storageConfig.bucketName,
      Key: filename,
    })

    const res = await this.client.send(command).catch((error: any) => {
      logger.error({ error }, "failed to upload file")
    })

    if (!res) return false
    if (res.$metadata.httpStatusCode !== 204) {
      return false
    }

    return true
  },

  async uploadMultipleImages(uploads: String[]) {
    let uploadedLocations: (string | undefined)[] = []
    if (uploads && Array.isArray(uploads)) {
      const uploadPromises = uploads.map(async (variationUpload) => {
        const filename = Date.now().toString() + ".png" // Extract file extension
        const base64 = variationUpload
        // const location = await this.uploadBase64(filename, base64)
        const location = await this.uploadBase64(filename, String(base64));
        return location // Return the location of the uploaded file
      })

      uploadedLocations = await Promise.all(uploadPromises)
    }
    const validUploadedLocations = uploadedLocations.filter(
      (location): location is string => location !== undefined,
    )
    return validUploadedLocations
  },
}
