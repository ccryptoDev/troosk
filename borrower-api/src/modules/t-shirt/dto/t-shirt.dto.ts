import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum Size {
  S = 'Small',
  M = 'Medium',
  L = 'Large',
  XL = 'Extra Large',
}

export class TShirtDto {
  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({
    description: 'Gender',
    example: 'Male',
  })
  gender: Gender;

  @IsNotEmpty()
  @IsEnum(Size)
  @ApiProperty({
    description: 'size',
    example: 'Small',
  })
  size: Size;
}
