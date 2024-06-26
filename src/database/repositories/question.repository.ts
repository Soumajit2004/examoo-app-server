import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Question } from '../../modules/question-paper/entites/question.entity';
import { CreateQuestionDto } from '../../modules/question-paper/dto/question/create-question.dto';
import { QuestionPaper } from '../../modules/question-paper/entites/question-paper.entity';

@Injectable()
export class QuestionRepository extends Repository<Question> {
  constructor(private dataSource: DataSource) {
    super(Question, dataSource.createEntityManager());
  }

  async createQuestion(
    questionPaper: QuestionPaper,
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const { questionText, questionType } = createQuestionDto;

    const question = this.create({
      questionText,
      questionType,
      parentQuestionPaper: questionPaper,
    });

    return await this.save(question);
  }
}
