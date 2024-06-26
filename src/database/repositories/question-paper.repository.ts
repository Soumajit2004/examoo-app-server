import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { QuestionPaper } from '../../modules/question-paper/entites/question-paper.entity';
import { CreateQuestionPaperDto } from '../../modules/question-paper/dto/question-paper/create-question-paper.dto';
import { User } from '../../modules/user/entites/user.entity';

@Injectable()
export class QuestionPaperRepository extends Repository<QuestionPaper> {
  constructor(private dataSource: DataSource) {
    super(QuestionPaper, dataSource.createEntityManager());
  }
  async getQuestionPaperById(questionPaperId: string) {
    const found = await this.findOneBy({ id: questionPaperId });

    if (!found) {
      throw new NotFoundException(
        `unable to find question paper with id:${questionPaperId}`,
      );
    }

    return found;
  }

  async createQuestionPaper(
    createQuestionPaperDto: CreateQuestionPaperDto,
    user: User,
  ): Promise<QuestionPaper> {
    const { name } = createQuestionPaperDto;

    const questionPaper = this.create({
      name,
      owner: user,
    });

    return await this.save(questionPaper);
  }
}
