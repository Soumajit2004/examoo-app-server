import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { QuestionPaper } from '../../modules/question-paper/entites/question-paper.entity';
import { CreateQuestionDto } from '../../modules/question-paper/dto/question/create-question.dto';
import { TextQuestion } from '../../modules/question-paper/entites/text-question.entity';

@Injectable()
export class TextQuestionRepository extends Repository<TextQuestion> {
  constructor(private dataSource: DataSource) {
    super(TextQuestion, dataSource.createEntityManager());
  }

  async createTextQuestion(
    questionPaper: QuestionPaper,
    createQuestionDto: CreateQuestionDto,
  ): Promise<TextQuestion> {
    const { questionText, questionType } = createQuestionDto;

    const question = this.create({
      questionText,
      questionType,
      parentQuestionPaper: questionPaper,
    });

    return await this.save(question);
  }
}
