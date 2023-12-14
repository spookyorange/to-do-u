import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  completed: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
}
