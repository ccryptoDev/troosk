import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserLoanAmount {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Loan Amount.',
    example: 5000,
  })
  loanAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Duration in month.',
    example: 36,
  })
  duration: number;
}
