import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AccountType {
  checking = 'Checking',
  savings = 'Savings',
}

export class AddBankDto {
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
    example: 'John Doe',
  })
  holderName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'routingNumber.',
    example: '091000019',
  })
  routingNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'accountNumber.',
    example: '4565656265656',
  })
  accountNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Checking or Savings.',
    example: AccountType.checking,
  })
  'ach_account_type': AccountType;
}
