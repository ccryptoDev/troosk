import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';

export class UpdateUserLoanAmount {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Loan Amount.',
    example: 0,
  })
  loanAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'APR.',
    example: 0,
  })
  apr: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Duration.',
    example: 0,
  })
  duration: number;
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateCustomerDetails {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'SocialSecurityNumber.',
    example: '956625XXXX',
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
    example: 3000,
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
