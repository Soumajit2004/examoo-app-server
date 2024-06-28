import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from '../../user/entites/user.entity';
import { McqQuestionRepository } from '../../../database/repositories/mcq-question.repository';
import { QuestionPaperRepository } from '../../../database/repositories/question-paper.repository';
import { QuestionPaperAccessControlService } from './question-paper-access-control.service';
import { McqQuestion } from '../entites/mcq-question.entity';
import { CreateQuestionDto } from '../dto/question/create-mcq-question.dto';
import { QuestionType } from '../entites/question-paper.entity';
import { NumericalQuestionRepository } from '../../../database/repositories/numerical-question.repository';
import { NumericalQuestion } from '../entites/numerical-question.entity';
import { TextQuestionRepository } from '../../../database/repositories/text-question.repository';
import { TextQuestion } from '../entites/text-question.entity';

@Injectable()
export class QuestionService {
  constructor(
    private readonly mcqQuestionRepository: McqQuestionRepository,
    private readonly numericalQuestionRepository: NumericalQuestionRepository,
    private readonly textQuestionRepository: TextQuestionRepository,
    private readonly questionPaperRepository: QuestionPaperRepository,
    private readonly questionPaperAccessControlService: QuestionPaperAccessControlService,
  ) {}

  async getQuestionById(
    questionId: string,
    questionPaperId: string,
    user: User,
  ): Promise<McqQuestion> {
    await this.questionPaperAccessControlService.verifyReadAccessOrFail(
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId),
      user,
    );

    const found = await this.mcqQuestionRepository.findOneBy({
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
  ): Promise<McqQuestion | NumericalQuestion | TextQuestion> {
    const questionPaper =
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId);

    await this.questionPaperAccessControlService.verifyOwnerAccessOrFail(
      questionPaper,
      user,
    );

    switch (createQuestionDto.questionType) {
      case QuestionType.MCQ:
        return this.mcqQuestionRepository.createMcqQuestion(
          questionPaper,
          createQuestionDto,
        );
      case QuestionType.NUMERICAL:
        return this.numericalQuestionRepository.createNumericalQuestion(
          questionPaper,
          createQuestionDto,
        );
      case QuestionType.TEXT:
        return this.textQuestionRepository.createTextQuestion(
          questionPaper,
          createQuestionDto,
        );
      default:
        throw new BadRequestException('invalid question type');
    }
  }
}
