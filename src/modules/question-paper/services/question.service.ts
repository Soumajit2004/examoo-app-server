import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { User } from '../../user/entites/user.entity';
import { QuestionRepository } from '../../../database/repositories/question.repository';
import { QuestionPaperService } from './question-paper.service';
import { Question } from '../entites/question.entity';
import { QuestionPaperRepository } from '../../../database/repositories/question-paper.repository';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionPaperRepository: QuestionPaperRepository,
    private readonly questionPaperService: QuestionPaperService,
  ) {}

  async getQuestionById(
    questionId: string,
    questionPaperId: string,
    user: User,
  ): Promise<Question> {
    await this.questionPaperService.verifyReadAccess(questionPaperId, user);

    const found = await this.questionRepository.findOneBy({
      id: questionId,
    });

    if (!found) {
      throw new NotFoundException(
        `unable to find question with id: ${questionId}`,
      );
    }

    return found;
  }

  async createQuestion(
    questionPaperId: string,
    createQuestionDto: CreateQuestionDto,
    user: User,
  ): Promise<Question> {
    await this.questionPaperService.verifyOwnerAccess(questionPaperId, user);

    const parentQuestionPaper =
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId);

    return this.questionRepository.createQuestion(
      parentQuestionPaper,
      createQuestionDto,
    );
  }
}
