import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { McqQuestionRepository } from '../../../database/repositories/mcq-question.repository';
import { McqQuestion } from '../entites/mcq-question.entity';
import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { QuestionType } from '../entites/question-paper.entity';
import { NumericalQuestionRepository } from '../../../database/repositories/numerical-question.repository';
import { NumericalQuestion } from '../entites/numerical-question.entity';
import { TextQuestionRepository } from '../../../database/repositories/text-question.repository';
import { TextQuestion } from '../entites/text-question.entity';
import { AddMcqOptionDto } from '../dto/question/add-mcq-option.dto';
import { AddAnswerDto } from '../dto/question/add-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { McqOption } from '../entites/mcq-option.entity';
import { Repository } from 'typeorm';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';
import { QuestionPaperService } from './question-paper.service';
import { User } from '../../user/entites/user.entity';

@Injectable()
export class QuestionService {
  constructor(
    private readonly mcqQuestionRepository: McqQuestionRepository,
    private readonly numericalQuestionRepository: NumericalQuestionRepository,
    private readonly textQuestionRepository: TextQuestionRepository,
    @InjectRepository(McqOption)
    private mcqOptionRepository: Repository<McqOption>,
    private readonly questionPaperService: QuestionPaperService,
  ) {}

  async getQuestionById(
    questionPaperId: string,
    questionId: string,
    user: User,
  ): Promise<McqQuestion | TextQuestion | NumericalQuestion> {
    const questionPaper = await this.questionPaperService.getQuestionPaperById(
      questionPaperId,
      user,
    );

    const filter = [
      ...questionPaper.numericalQuestions,
      ...questionPaper.textQuestions,
      ...questionPaper.mcqQuestions,
    ].filter((q) => {
      if (q.id === questionId) {
        return q;
      }
    });

    if (filter.length > 0) {
      return filter[0];
    }

    throw new NotFoundException(
      `unable to find question with id: ${questionId}`,
    );
  }

  async createQuestion(
    questionPaperId: string,
    createQuestionDto: CreateQuestionDto,
    user: User,
  ): Promise<McqQuestion | NumericalQuestion | TextQuestion> {
    const questionPaper = await this.questionPaperService.getQuestionPaperById(
      questionPaperId,
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

  async updateQuestion(
    questionPaperId: string,
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
    user: User,
  ): Promise<McqQuestion | TextQuestion | NumericalQuestion> {
    const { questionText } = updateQuestionDto;

    const question = await this.getQuestionById(
      questionPaperId,
      questionId,
      user,
    );

    question.questionText = questionText;

    if (question instanceof McqQuestion) {
      return await this.mcqQuestionRepository.save(question);
    } else if (question instanceof TextQuestion) {
      return await this.textQuestionRepository.save(question);
    } else if (question instanceof NumericalQuestion) {
      return await this.numericalQuestionRepository.save(question);
    }

    throw new BadRequestException('invalid question type');
  }

  async addAnswer(
    questionPaperId: string,
    questionId: string,
    addAnswerDto: AddAnswerDto,
    user: User,
  ): Promise<McqQuestion | TextQuestion | NumericalQuestion> {
    const question = await this.getQuestionById(
      questionPaperId,
      questionId,
      user,
    );

    if (question instanceof McqQuestion && addAnswerDto.mcqOptionId) {
      const option = await this.mcqOptionRepository.findOneOrFail({
        where: { id: addAnswerDto.mcqOptionId },
      });

      return this.mcqQuestionRepository.addAnswer(question, option);
    } else if (
      question instanceof NumericalQuestion &&
      addAnswerDto.numericalAnswer
    ) {
      return this.numericalQuestionRepository.addAnswer(
        question,
        addAnswerDto.numericalAnswer,
      );
    } else if (question instanceof TextQuestion && addAnswerDto.textAnswer) {
      return this.textQuestionRepository.addAnswer(
        question,
        addAnswerDto.textAnswer,
      );
    } else {
      throw new BadRequestException('question type and answer mismatch');
    }
  }

  async addMcqOption(
    questionPaperId: string,
    questionId: string,
    addMcqOptionDto: AddMcqOptionDto,
    user: User,
  ): Promise<McqQuestion> {
    const question = await this.getQuestionById(
      questionPaperId,
      questionId,
      user,
    );

    if (
      question instanceof McqQuestion &&
      question.questionType === QuestionType.MCQ
    ) {
      return this.mcqQuestionRepository.addMcqOption(question, addMcqOptionDto);
    }

    throw new BadRequestException(`question must be of mmq type`);
  }
}
