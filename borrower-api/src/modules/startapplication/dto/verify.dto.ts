import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Verify } from '../../../entities/loan.entity';


export class VerifyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Enum value from the list: pass, fail, warning',
    example: Verify.pass,
    enum: Verify,
    enumName: 'Verify'
  })
  isVerified: Verify;
}
