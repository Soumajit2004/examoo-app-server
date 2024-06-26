import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateQuestionPaperDto {
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
