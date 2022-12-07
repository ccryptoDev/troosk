import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AchDisbursementDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'ACH payment method token.',
    example: '537073012',
  })
  'ach_token': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Amount to be payed.',
    example: '50.00',
  })
  'amount': string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Customer ID.',
    example: '26d41975-e51c-49c0-be51-39b9879d99c0',
  })
  'customer_id': string;
}
