import { IsEnum, IsNotEmpty } from 'class-validator';
import { QuestionType } from '../../entites/question.entity';

export class CreateQuestionDto {
  @IsNotEmpty()
  questionText: string;

  @IsEnum(QuestionType)
  questionType: QuestionType;
}
