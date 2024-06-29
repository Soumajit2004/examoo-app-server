import { IsEnum, IsNotEmpty } from 'class-validator';
import { QuestionType } from '../../entites/question-paper.entity';

export class CreateQuestionDto {
  @IsNotEmpty()
  questionText: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType: QuestionType;
}
