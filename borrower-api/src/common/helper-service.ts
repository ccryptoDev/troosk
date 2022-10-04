import { Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as pupeetree from 'puppeteer';
import { extname } from 'path';
import { config } from 'dotenv';

config();
export class CommonService {
  async convertHTMLToPDF(loanId, htmlContent, filename) {
    const browser = await pupeetree.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const contractInPDF = await page.pdf({
      path: filename,
      format: 'a4',
      printBackground: true,
    });
    const bucketS3 = process.env.S3BUCKET;
    let fileName = filename;
    const name = fileName.split('.')[0];
    const fileExtName = extname(fileName);
    fileName = `${process.env.awsS3ChildFolderPath}${name}-${loanId}${fileExtName}`;

    return this.uploadS3(contractInPDF, bucketS3, fileName);
  }

  async getFileFromS3(fileName) {
    const s3client = this.getS3();
    const params = {
      Bucket: process.env.S3BUCKET,
      Key: process.env.awsS3ChildFolderPath + fileName,
    };

    const data = await s3client.getObject(params).promise();
    if (!data) throw Error('There was an error getting the file');

    return data;
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
