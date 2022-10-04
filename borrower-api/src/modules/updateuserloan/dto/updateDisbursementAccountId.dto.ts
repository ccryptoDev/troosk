import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDisbursementAccountIdDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Disbursement account id',
    example: '1234567890',
  })
  disbursementAccountId: string;
}
