import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { QuestionPaper } from '../../entites/question-paper/question-paper.entity';
import { User } from '../../entites/user.entity';
import { CreateQuestionPaperDto } from '../../../../modules/question-paper/dto/question-paper/create-question-paper.dto';
import { UpdateQuestionPaperDto } from '../../../../modules/question-paper/dto/question-paper/update-question-paper.dto';

@Injectable()
export class QuestionPaperRepository extends Repository<QuestionPaper> {
  constructor(private dataSource: DataSource) {
    super(QuestionPaper, dataSource.createEntityManager());
  }

  async createQuestionPaper(
    createQuestionPaperDto: CreateQuestionPaperDto,
    user: User,
  ): Promise<QuestionPaper> {
    const { name } = createQuestionPaperDto;

    const questionPaper = this.create({
      name,
      owner: user,
      mcqQuestions: [],
      textQuestions: [],
      numericalQuestions: [],
    });

    return await this.save(questionPaper);
  }

  async updateQuestionPaper(
    questionPaper: QuestionPaper,
    updateQuestionPaperDto: UpdateQuestionPaperDto,
  ): Promise<QuestionPaper> {
    const { name } = updateQuestionPaperDto;

    if (name) {
      questionPaper.name = name;
    }

    return await this.save(questionPaper);
  }
}
