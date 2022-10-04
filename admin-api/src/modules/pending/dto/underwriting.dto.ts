import { IsNotEmpty, IsString } from 'class-validator';

export class underWritingDto {
  @IsNotEmpty()
  @IsString()
  reason: string;
}
