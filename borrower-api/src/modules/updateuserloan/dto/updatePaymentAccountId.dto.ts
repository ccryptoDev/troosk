import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentAccountIdDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Payment account id',
    example: '1234567890',
  })
  paymentAccountId: string;
}
