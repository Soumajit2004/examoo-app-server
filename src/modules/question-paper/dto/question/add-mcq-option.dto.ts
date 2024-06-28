import { IsNotEmpty, IsString } from 'class-validator';

export class AddMcqOptionDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}
