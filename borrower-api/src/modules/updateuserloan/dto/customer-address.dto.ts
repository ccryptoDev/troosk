import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerAddressDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Social Security Number',
    example: '666927711',
  })
  socialSecurityNumber: string;

  @IsString()
  @ApiProperty({
    description: 'FirstName',
    example: 'KAREN',
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    description: 'MiddleName',
    example: 'K',
  })
  middleName: string;

  @IsString()
  @ApiProperty({
    description: 'LastName',
    example: 'ALBERTS',
  })
  lastName: string;

  @IsString()
  @ApiProperty({
    description: 'Address Line',
    example: '213 Janet Ln',
  })
  addressLine1: string;

  @IsString()
  @ApiProperty({
    description: 'Date of birth',
    example: '1963-May-01',
  })
  birthday: string;
}
