import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardTokenPaymentDto {
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
    description: 'Card payment method token.',
    example: '559540033',
  })
  'card_token': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Amount to be payed.',
    example: '50.00',
  })
  'amount': string;
}
