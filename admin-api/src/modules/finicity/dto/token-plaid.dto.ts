import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  token: any;
}

export class generateurl {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  consumerId: string;

  // @IsString()
  // webhook: string

  // @IsString()
  // experience: string
}

export class createCustomerDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}

export class createConsumerDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zip: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  ssn: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsNumber()
  month: number;

  @IsNotEmpty()
  @IsNumber()
  dayOfMonth: number;

  @IsNotEmpty()
  @IsString()
  suffix: string;
}
