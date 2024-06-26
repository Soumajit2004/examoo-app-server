import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTextAnswerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  correctText: string;
}
