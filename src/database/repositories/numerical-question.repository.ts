import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { QuestionPaper } from '../../modules/question-paper/entites/question-paper.entity';
import { CreateQuestionDto } from '../../modules/question-paper/dto/question/create-mcq-question.dto';
import { NumericalQuestion } from '../../modules/question-paper/entites/numerical-question.entity';

@Injectable()
export class NumericalQuestionRepository extends Repository<NumericalQuestion> {
  constructor(private dataSource: DataSource) {
    super(NumericalQuestion, dataSource.createEntityManager());
  }

  async createNumericalQuestion(
    questionPaper: QuestionPaper,
    createQuestionDto: CreateQuestionDto,
  ): Promise<NumericalQuestion> {
    const { questionText, questionType } = createQuestionDto;

    const question = this.create({
      questionText,
      questionType,
      parentQuestionPaper: questionPaper,
    });

    return await this.save(question);
  }
}
