import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { McqQuestionRepository } from '../../../database/repositories/mcq-question.repository';
import { QuestionPaperRepository } from '../../../database/repositories/question-paper.repository';
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

@Injectable()
export class QuestionService {
  constructor(
    private readonly mcqQuestionRepository: McqQuestionRepository,
    private readonly numericalQuestionRepository: NumericalQuestionRepository,
    private readonly textQuestionRepository: TextQuestionRepository,
    private readonly questionPaperRepository: QuestionPaperRepository,
    @InjectRepository(McqOption)
    private mcqOptionRepository: Repository<McqOption>,
  ) {}

  async getQuestionById(
    questionId: string,
  ): Promise<McqQuestion | TextQuestion | NumericalQuestion> {
    let found: McqQuestion | TextQuestion | NumericalQuestion;

    for (const repository of [
      this.mcqQuestionRepository,
      this.numericalQuestionRepository,
      this.textQuestionRepository,
    ]) {
      found = await repository.findOneBy({
        id: questionId,
      });

      if (found) {
        return found;
      }
    }

    throw new NotFoundException(
      `unable to find question with id: ${questionId}`,
    );
  }

  async createQuestion(
    questionPaperId: string,
    createQuestionDto: CreateQuestionDto,
  ): Promise<McqQuestion | NumericalQuestion | TextQuestion> {
    const questionPaper =
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId);

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
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<McqQuestion | TextQuestion | NumericalQuestion> {
    const { questionText } = updateQuestionDto;

    const question = await this.getQuestionById(questionId);
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
    questionId: string,
    addAnswerDto: AddAnswerDto,
  ): Promise<McqQuestion | TextQuestion | NumericalQuestion> {
    const question = await this.getQuestionById(questionId);

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
    questionId: string,
    addMcqOptionDto: AddMcqOptionDto,
  ): Promise<McqQuestion> {
    const mcqQuestion = await this.getQuestionById(questionId);

    if (
      mcqQuestion instanceof McqQuestion &&
      mcqQuestion.questionType === QuestionType.MCQ
    ) {
      return this.mcqQuestionRepository.addMcqOption(
        mcqQuestion,
        addMcqOptionDto,
      );
    }

    throw new BadRequestException(`invalid question type`);
  }
}
