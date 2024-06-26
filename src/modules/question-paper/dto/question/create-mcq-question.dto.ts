import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { QuestionType } from '../../../../common/database/entites/question-paper/question-paper.entity';

export class CreateQuestionDto {
  @IsNotEmpty()
  questionText: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType: QuestionType;

  @IsOptional()
  imageUrl?: string;
}
