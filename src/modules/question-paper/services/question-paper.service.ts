import { Injectable } from '@nestjs/common';

import { QuestionPaperRepository } from '../../../database/repositories/question-paper.repository';
import { CreateQuestionPaperDto } from '../dto/create-question-paper.dto';
import { User } from '../../user/entites/user.entity';
import { QuestionPaper } from '../entites/question-paper.entity';

@Injectable()
export class QuestionPaperService {
  constructor(
    private readonly questionPaperRepository: QuestionPaperRepository,
  ) {}

  async createQuestionPaper(
    createQuestionPaperDto: CreateQuestionPaperDto,
    user: User,
  ): Promise<QuestionPaper> {
    return await this.questionPaperRepository.createQuestionPaper(
      createQuestionPaperDto,
      user,
    );
  }
}
