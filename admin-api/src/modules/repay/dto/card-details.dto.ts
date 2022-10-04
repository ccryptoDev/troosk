import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardDetailsDto {
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
  'cardholder_name': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Card Number.',
    example: '4111111111111111',
  })
  'card_number': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'CVC card security code.',
    example: '123',
  })
  'card_cvc': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The card expiration date in the format: MMYY.',
    example: '1225',
  })
  'card_expiration': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Customer address zip.',
    example: '99999',
  })
  'address_zip': string;
}
