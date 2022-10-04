import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
export class CreateCreditpullDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  MiddleName: string;

  @IsNotEmpty()
  @IsString()
  SuffixName: string;

  @IsNotEmpty()
  @IsString()
  AddressLineText: string;

  @IsNotEmpty()
  @IsString()
  CityName: string;

  @IsNotEmpty()
  @IsString()
  CountryCode: string;

  @IsNotEmpty()
  @IsNumber()
  PostalCode: number;

  @IsNotEmpty()
  @IsString()
  StateCode: string;

  @IsNotEmpty()
  @IsNumber()
  TaxpayerIdentifierValue: number;
}
