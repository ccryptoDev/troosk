import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDetailsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'SocialSecurityNumber.',
    example: '666449944',
  })
  socialSecurityNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'EmploymentType.',
    example: 'permanent',
  })
  employmentType: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'AnnualIncome.',
    example: 25000,
  })
  annualIncome: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'PurposeOfLoan.',
    example: 'Education',
  })
  purposeOfLoan: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'mobilePhone.',
    example: '9486283817',
  })
  mobilePhone: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'PhoneConsentPolicy.',
    example: true,
  })
  phoneConsentPolicy: string;

  @IsString()
  @ApiProperty({
    description: 'otherPhoneNo.',
    example: '9486267647',
  })
  otherPhoneNo: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'EmailAddress.',
    example: 'alchemy@gmail.com',
  })
  emailAddress: string;
}
