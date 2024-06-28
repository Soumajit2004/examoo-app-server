import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { McqQuestion } from '../../modules/question-paper/entites/mcq-question.entity';
import { QuestionPaper } from '../../modules/question-paper/entites/question-paper.entity';
import { CreateQuestionDto } from '../../modules/question-paper/dto/question/create-mcq-question.dto';

@Injectable()
export class McqQuestionRepository extends Repository<McqQuestion> {
  constructor(private dataSource: DataSource) {
    super(McqQuestion, dataSource.createEntityManager());
  }

  async createMcqQuestion(
    questionPaper: QuestionPaper,
    createQuestionDto: CreateQuestionDto,
  ): Promise<McqQuestion> {
    const { questionText, questionType } = createQuestionDto;

    const question = this.create({
      questionText,
      questionType,
      parentQuestionPaper: questionPaper,
    });

    return await this.save(question);
  }
}
