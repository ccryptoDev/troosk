import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class UpdateUserName {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'first Name.',
    example: 'abc',
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    description: 'Middle Name.',
    example: 'Test',
  })
  middleName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'last Name.',
    example: 'xyz',
  })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'zipcode.',
    example: '628904',
  })
  zipcode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'phoneNo.',
    example: '6434674357',
  })
  phoneno: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Email.',
    example: 'abc@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'street Address.',
    example: 'West Street',
  })
  streetAddress: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'city.',
    example: 'chennai',
  })
  city: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'unit.',
    example: 'S4',
  })
  unit: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'socialSecurityNumber.',
    example: '123456789',
  })
  socialSecurityNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'state.',
    example: 'California',
  })
  state: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Birthday.',
    example: '08/12/1996',
  })
  birthday: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'sourceOfIncome.',
    example: 'Salaried',
  })
  sourceOfIncome: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'netMonthlyIncome.',
    example: 200000,
  })
  netMonthlyIncome: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'payFrequency.',
    example: 'Monthly',
  })
  payFrequency: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'dayOfMonth.',
    example: 9,
  })
  dayOfMonth: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'paidFormat.',
    example: 'check',
  })
  paidFormat: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'password.',
    example: 'welcome',
  })
  password: string;
}

export class selectLoan {
  @IsNotEmpty()
  @IsString()
  loan_id: string;
}
