import { IsNotEmpty } from 'class-validator';

export class CreateQuestionPaperDto {
  @IsNotEmpty()
  name: string;
}
