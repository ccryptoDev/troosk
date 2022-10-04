import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUploadDto {
  @IsNotEmpty()
  @IsString()
  loan_id: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  files: any;
}

export class createPaymentSchedulerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'loan_id.',
    example: 'f15e1e4f5e4f54e5fe',
  })
  loan_id: string;
}
export class DeleteUploadFileDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}

export class AddConsentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Consent)
  consent: Consent[];
}

export class Consent {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
