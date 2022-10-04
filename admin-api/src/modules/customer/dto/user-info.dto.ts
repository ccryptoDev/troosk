import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserNameDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'first Name.',
    example: 'Test',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'last Name.',
    example: 'Test',
  })
  lastName: string;
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateUserStreetDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'street Address.',
    example: 'Test',
  })
  streetAddress: string;
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateUserCityDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'city.',
    example: 'Test',
  })
  city: string;
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateUserZipCodeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'zip Code.',
    example: 123456,
  })
  zipCode: string;
}
