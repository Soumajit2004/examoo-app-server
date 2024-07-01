import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { AddMcqOptionDto } from '../dto/question/add-mcq-option.dto';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';
import { QuestionPaperService } from './question-paper.service';
import { McqQuestionRepository } from '../../../common/database/repositories/question-paper/question/mcq-question.repository';
import { NumericalQuestionRepository } from '../../../common/database/repositories/question-paper/question/numerical-question.repository';
import { TextQuestionRepository } from '../../../common/database/repositories/question-paper/question/text-question.repository';
import { User } from '../../../common/database/entites/user.entity';
import { McqQuestion } from '../../../common/database/entites/question-paper/question/mcq-question.entity';
import { TextQuestion } from '../../../common/database/entites/question-paper/question/text-question.entity';
import { NumericalQuestion } from '../../../common/database/entites/question-paper/question/numerical-question.entity';
import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { QuestionType } from '../../../common/database/entites/question-paper/question-paper.entity';
import { McqOptionRepository } from '../../../common/database/repositories/question-paper/question/mcq-option.repository';
import { QuestionImageUploadService } from '../../../common/upload/question-paper/question-image-upload.service';
import { McqOptionImageUploadService } from '../../../common/upload/question-paper/mcq-option-image-upload.service';
import { McqOption } from '../../../common/database/entites/question-paper/question/mcq-option.entity';

@Injectable()
export class QuestionService {
  logger = new Logger(QuestionService.name);

  constructor(
    private readonly mcqQuestionRepository: McqQuestionRepository,
    private readonly numericalQuestionRepository: NumericalQuestionRepository,
    private readonly textQuestionRepository: TextQuestionRepository,
    private readonly mcqOptionRepository: McqOptionRepository,
    private readonly questionPaperService: QuestionPaperService,
    private readonly questionImageUploadService: QuestionImageUploadService,
    private readonly mcqOptionImageUploadService: McqOptionImageUploadService,
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
    imageFile?: Express.Multer.File,
  ): Promise<McqQuestion | NumericalQuestion | TextQuestion> {
    const questionPaper = await this.questionPaperService.getQuestionPaperById(
      questionPaperId,
      user,
    );
    let question: McqQuestion | NumericalQuestion | TextQuestion;

    const { questionType } = createQuestionDto;
    if (questionType === QuestionType.MCQ) {
      question = await this.mcqQuestionRepository.createMcqQuestion(
        questionPaper,
        createQuestionDto,
      );
    } else if (questionType === QuestionType.NUMERICAL) {
      question = await this.numericalQuestionRepository.createNumericalQuestion(
        questionPaper,
        createQuestionDto,
      );
    } else if (questionType === QuestionType.TEXT) {
      question = await this.textQuestionRepository.createTextQuestion(
        questionPaper,
        createQuestionDto,
      );
    }
    this.logger.verbose(`Created question paper with id: ${question.id}`);

    if (imageFile) {
      await this.questionImageUploadService.uploadImage(question.id, imageFile);
    }

    return question;
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

  async deleteQuestion(
    questionPaperId: string,
    questionId: string,
    user: User,
  ) {
    const question = await this.getQuestionById(
      questionPaperId,
      questionId,
      user,
    );

    if (question instanceof McqQuestion) {
      await this.mcqQuestionRepository.remove(question);
    } else if (question instanceof TextQuestion) {
      await this.textQuestionRepository.remove(question);
    } else if (question instanceof NumericalQuestion) {
      await this.numericalQuestionRepository.remove(question);
    }
  }

  async addMcqOption(
    questionPaperId: string,
    questionId: string,
    addMcqOptionDto: AddMcqOptionDto,
    user: User,
    imageFile?: Express.Multer.File,
  ): Promise<McqOption> {
    const question = await this.getQuestionById(
      questionPaperId,
      questionId,
      user,
    );

    if (question instanceof McqQuestion) {
      const option = await this.mcqQuestionRepository.addMcqOption(
        question,
        addMcqOptionDto,
      );

      if (imageFile) {
        await this.mcqOptionImageUploadService.uploadImage(
          option.id,
          imageFile,
        );

        option.isImageAdded = true;

        return await this.mcqOptionRepository.save(option);
      }

      return option;
    }

    throw new BadRequestException(`question must be of mcq type`);
  }

  async removeMcqOption(
    questionPaperId: string,
    questionId: string,
    optionId: string,
    user: User,
  ): Promise<void> {
    const question = await this.getQuestionById(
      questionPaperId,
      questionId,
      user,
    );

    if (question instanceof McqQuestion) {
      question.mcqOptions.forEach((o) => {
        if (o.id === optionId) {
          this.mcqOptionRepository.remove(o);
        }
      });
    } else {
      throw new BadRequestException('question must be of mcq type');
    }
  }
}
