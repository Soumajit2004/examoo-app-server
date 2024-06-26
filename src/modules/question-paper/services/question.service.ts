import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { User } from '../../user/entites/user.entity';
import { QuestionRepository } from '../../../database/repositories/question.repository';
import { QuestionPaperService } from './question-paper.service';
import { Question } from '../entites/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionPaperService: QuestionPaperService,
  ) {}

  async getQuestionById(questionId: string): Promise<Question> {
    const found = await this.questionRepository.findOneBy({ id: questionId });

    if (!found) {
      throw new NotFoundException(
        `unable to find question with id: ${questionId}`,
      );
    }

    return found;
  }

  async createQuestionPaper(
    questionPaperId: string,
    createQuestionDto: CreateQuestionDto,
    user: User,
  ): Promise<Question> {
    const parentQuestionPaper =
      await this.questionPaperService.getQuestionPaperById(
        questionPaperId,
        user,
      );

    return this.questionRepository.createQuestion(
      parentQuestionPaper,
      createQuestionDto,
    );
  }
}
