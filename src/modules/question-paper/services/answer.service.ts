import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateTextAnswerDto } from '../dto/answer/text/create-text-answer.dto';
import { TextAnswerRepository } from '../../../database/repositories/answer/text-answer.repository';
import { QuestionPaperRepository } from '../../../database/repositories/question-paper.repository';
import { QuestionPaperAccessControlService } from './question-paper-access-control.service';
import { User } from '../../user/entites/user.entity';
import { QuestionRepository } from '../../../database/repositories/question.repository';
import { Question, QuestionType } from '../entites/question.entity';

@Injectable()
export class AnswerService {
  constructor(
    private readonly questionPaperRepository: QuestionPaperRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly questionPaperAccessControlService: QuestionPaperAccessControlService,
    private readonly textAnswerRepository: TextAnswerRepository,
  ) {}

  async createTextAnswer(
    questionPaperId: string,
    questionId: string,
    createTextAnswerDto: CreateTextAnswerDto,
    user: User,
  ): Promise<Question> {
    await this.questionPaperAccessControlService.verifyOwnerAccessOrFail(
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId),
      user,
    );

    const question = await this.questionRepository.getQuestionById(questionId);

    if (!question.answerAdded && question.questionType === QuestionType.TEXT) {
      return await this.textAnswerRepository.createTextAnswer(
        question,
        createTextAnswerDto,
      );
    }

    throw new BadRequestException('answer already added');
  }
}
