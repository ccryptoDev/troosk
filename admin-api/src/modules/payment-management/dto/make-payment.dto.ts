import { IsNotEmpty, IsNumber } from 'class-validator';

export class MakePaymentDTO {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
