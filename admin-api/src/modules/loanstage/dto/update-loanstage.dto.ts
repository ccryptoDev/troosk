import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

import { CreateLoanstageDto } from './create-loanstage.dto';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class UpdateLoanstageDto extends PartialType(CreateLoanstageDto) {}

export class UpdateStageDto {
  @IsNotEmpty()
  @IsString()
  stage: string;
}
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

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Orgination Fee.',
    example: 0,
  })
  orginationFee: number;
}

export class TshirtDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'gender',
  })
  gender: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'size',
  })
  size: string;
}

export class createPaymentSchedulerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'loan_id.',
    example: 'f15e1e4f5e4f54e5fe',
  })
  loan_id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '  paymentFrequency',
    example: 'M',
  })
  paymentFrequency: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Date',
    example: '',
  })
  date: string;
}
export class manualBankAddDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Bank Name.',
    example: 'Test bank',
  })
  bankName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'BankHolder Name.',
    example: 'Test user',
  })
  holderName: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'routingNumber.',
    example: '12345',
  })
  routingNumber: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'accountNumber.',
    example: '4565656265656',
  })
  accountNumber: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'user_id.',
    example: 'f15e1e4f5e4f54e5fe',
  })
  user_id: string;
}
