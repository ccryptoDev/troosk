import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddConsentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Consent)
  consent: Consent[];
}

// tslint:disable-next-line:max-classes-per-file
export class Consent {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
