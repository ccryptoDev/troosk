import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FinicityIdDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Finicity ID',
    example: '666927711',
  })
  finicityId: string;
}
