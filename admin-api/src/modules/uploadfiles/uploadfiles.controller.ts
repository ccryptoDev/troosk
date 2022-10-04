import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { UploadfilesService } from './uploadfiles.service';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Logger } from '@nestjs/common';
import {
  CreateUploadDto,
  createPaymentSchedulerDto,
  DeleteUploadFileDto,
  AddConsentDto,
} from '../uploadfiles/dto/create-uploadfile.dto';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('role', roles);
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|txt|json)$/)) {
    return callback(
      {
        statusCode: 400,
        message: 'Only jpg,jpeg,png,pdf are allowed!',
        error: 'Bad Request',
      },
      false,
    );
    //return callback(new Error('Only jpg,jpeg,png,pdf are allowed!'), false);
  }
  callback(null, true);
};

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
      filename: filename,
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
      statusCode: 200,
      data: uploadFileDetails,
    };
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

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all document files' })
  async getDocument(@Param('id', ParseUUIDPipe) id: string) {
    return this.uploadfilesService.getDocument(id);
  }

  @Get('/user/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user upload document files' })
  async getUserDocument(@Param('id', ParseUUIDPipe) id: string) {
    return this.uploadfilesService.getUserDocument(id);
  }

  @Post('/pending')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Moved to pending stage ' })
  async pendingStage(
    @Body() createPaymentSchedulerDto: createPaymentSchedulerDto,
  ) {
    return this.uploadfilesService.pendingStage(createPaymentSchedulerDto);
  }

  @Get('/paymentSchedule/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all payment schedule for user' })
  async getPaymentSchedule(@Param('id', ParseUUIDPipe) id: string) {
    return this.uploadfilesService.getPaymentSchedule(id);
  }

  @Post('DeleteUploadFile/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete User Upload Files' })
  async deleteUploadFile(
    @Body() deleteUploadFileDto: DeleteUploadFileDto,
    @Param('loan_id') loan_id: string,
  ) {
    console.log('hai' + ' ' + deleteUploadFileDto + ' ' + loan_id);
    try {
      return this.uploadfilesService.deleteUploadFile(
        loan_id,
        deleteUploadFileDto,
      );
    } catch (error) {
      return { statusCode: 400, message: error.response.data.error_message };
    }
  }

  @Get('GetConsentFiles/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Consent File' })
  async getConsentFiles(@Param('country') country: string) {
    return this.uploadfilesService.getConsentFiles(country);
  }

  @Post('addConsent/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add Consent File' })
  async addConsent(
    @Body() addConsentDto: AddConsentDto,
    @Param('country') country: string,
  ) {
    return this.uploadfilesService.addConsent(country, addConsentDto);
  }

  @Post('addNotes/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add Notes File' })
  async addNotes(
    @Body() addConsentDto: AddConsentDto,
    @Param('country') country: string,
  ) {
    return this.uploadfilesService.addNotes(country, addConsentDto);
  }

  @Get('Getnotes/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Notes File' })
  async getnotes(@Param('country') country: string) {
    return this.uploadfilesService.getNotes(country);
  }
}
