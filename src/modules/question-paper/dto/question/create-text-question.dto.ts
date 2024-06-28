import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMcqQuestionDto {
  @IsNotEmpty()
  questionText: string;

  @IsOptional()
  imageUrl?: string;
}
