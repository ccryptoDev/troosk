import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartApplication {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'identificationNumber.',
    example: 'CA-A123456',
  })
  identificationNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'firstName.',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'middleName.',
    example: 'Robert',
  })
  middleName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'lastName.',
    example: 'Doe',
  })
  lastName: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'streetNumber.',
    example: 128,
  })
  streetNumber: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'streetName.',
    example: 'Lakeview Street',
  })
  streetName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'unitNumber.',
    example: '18',
  })
  unitNumber?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'city.',
    example: 'Philadelphia',
  })
  city: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'state.',
    example: 'Pennsylvania',
  })
  state: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1001',
  })
  kioskId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'CA',
  })
  kioskState: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'zipCode.',
    example: '19019',
  })
  zipCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'month.',
    example: 'April',
  })
  month: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'day.',
    example: '09',
  })
  day: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'year.',
    example: '1991',
  })
  year: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Address line',
    example: '14900 Atlantic Ave, East Compton, CA 90221',
  })
  addressLine1: string;
}

// tslint:disable-next-line:max-classes-per-file
export class OtpCreadentialsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'emailotp.',
    example: '6261',
  })
  emailotp: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'mobileotp.',
    example: '6261',
  })
  mobileotp: string;
}
