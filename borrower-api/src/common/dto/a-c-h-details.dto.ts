import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AccountType {
  checking = 'Checking',
  savings = 'Savings',
}

export enum TransactionType {
  auth = 'auth',
  sale = 'sale',
  scheduled_sale = 'scheduled_sale',
}

export enum PaymentMethod {
  ach = 'ach',
  card = 'card',
  achToken = 'ach_token',
  cardToken = 'card_token',
}

export class ACHDetailsDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Customer ID.',
    example: '26d41975-e51c-49c0-be51-39b9879d99c0',
  })
  'customer_id': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Account holder name on bank account.',
    example: 'REPAY TEST',
  })
  'name_on_check': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'ACH Account Number.',
    example: '987654321',
  })
  'ach_account_number': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Customer email.',
    example: 'example@test.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Customer address zip.',
    example: '99999',
  })
  'address_zip': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'This is the 9-digit bank account routing number.',
    example: '111000614',
  })
  'ach_routing_number': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'This is about whom initialize the payment. (WEB - customer, TEL - agent)',
    example: 'WEB',
  })
  'sec_code': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Checking or Savings.',
    example: AccountType.checking,
  })
  'ach_account_type': AccountType;
}
