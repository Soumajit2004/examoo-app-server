import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { User } from '../../user/entites/user.entity';
import { QuestionRepository } from '../../../database/repositories/question.repository';
import { Question } from '../entites/question.entity';
import { QuestionPaperRepository } from '../../../database/repositories/question-paper.repository';
import { QuestionPaperAccessControlService } from './question-paper-access-control.service';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionPaperRepository: QuestionPaperRepository,
    private readonly questionPaperAccessControlService: QuestionPaperAccessControlService,
  ) {}

  async getQuestionById(
    questionId: string,
    questionPaperId: string,
    user: User,
  ): Promise<Question> {
    await this.questionPaperAccessControlService.verifyReadAccessOrFail(
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId),
      user,
    );

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
    const questionPaper =
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId);

    await this.questionPaperAccessControlService.verifyOwnerAccessOrFail(
      questionPaper,
      user,
    );

    return this.questionRepository.createQuestion(
      questionPaper,
      createQuestionDto,
    );
  }
}
