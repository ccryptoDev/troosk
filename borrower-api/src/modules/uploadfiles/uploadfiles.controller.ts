import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadfilesService } from './uploadfiles.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddConsentDto } from './dto/create-uploadfile.dto';
import { extname } from 'path';
import { CreateUploadDto } from './dto/create-upload.dto';
import { S3 } from 'aws-sdk';
import { imageFileFilter } from '../uploads/uploads.controller';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Upload File')
@Controller('uploadfiles')
export class UploadfilesController {
  constructor(private readonly uploadfilesService: UploadfilesService) {}

  @Post('/uploads')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUploadDto })
  @ApiOperation({ summary: 'Files upload' })
  async uploadMultipleFiles(
    @UploadedFiles() files,
    @Body() createUploadDto: CreateUploadDto,
  ) {
    const name = files[0].originalname.split('.');
    const fileExtName = extname(files[0].originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const filename = `${process.env.awsS3ChildFolderPath}${name}-${randomName}${fileExtName}`;
    const fileReponse = {
      originalfileName: files[0].originalname,
      filename,
    };
    const bucketS3 = process.env.S3BUCKET;
    const uploadFileDetails = await this.uploadS3(
      files[0].buffer,
      bucketS3,
      filename,
    );
    const exactFileName = `${name}-${randomName}${fileExtName}`;
    await this.uploadfilesService.save(
      fileReponse,
      createUploadDto,
      exactFileName,
    );
    return {
      statusCode: HttpStatus.OK,
      data: uploadFileDetails,
    };
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
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
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  @Get('GetConsentFiles/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Consents' })
  async getConsentFiles(@Param('country') country: string) {
    return this.uploadfilesService.getConsentFiles(country);
  }

  @Post('addConsent/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add Consents' })
  async addConsent(
    @Body() addConsentDto: AddConsentDto,
    @Param('country') country: string,
  ) {
    return this.uploadfilesService.addConsent(country, addConsentDto);
  }

  @Post('signConsents/:country/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign Consents' })
  async signConsents(
    @Param('country') country: string,
    @Param('loanId') loanId: string,
  ) {
    return this.uploadfilesService.signConsents(country, loanId);
  }

  @Get('consentsInPdf/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Consents in PDF' })
  async getConsentsInPdf(@Param('loanId') loanId: string) {
    return this.uploadfilesService.getConsentsInPdf(loanId);
  }

  @Post('addNotes/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add Notes' })
  async addNotes(
    @Body() addConsentDto: AddConsentDto,
    @Param('country') country: string,
  ) {
    return this.uploadfilesService.addNotes(country, addConsentDto);
  }

  @Get('Getnotes/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Notes' })
  async getnotes(@Param('country') country: string) {
    return this.uploadfilesService.getNotes(country);
  }

  @Post('addfaq/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add FAQs' })
  async addFaq(
    @Body() addConsentDto: AddConsentDto,
    @Param('country') country: string,
  ) {
    return this.uploadfilesService.addFaq(country, addConsentDto);
  }

  @Get('getfaq/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get FAQs' })
  async getFaq(@Param('country') country: string) {
    return this.uploadfilesService.getFaq(country);
  }
}
