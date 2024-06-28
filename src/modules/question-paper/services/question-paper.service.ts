import { BadRequestException, Injectable } from '@nestjs/common';

import { QuestionPaperRepository } from '../../../database/repositories/question-paper.repository';
import { CreateQuestionPaperDto } from '../dto/question-paper/create-question-paper.dto';
import { User } from '../../user/entites/user.entity';
import { QuestionPaper } from '../entites/question-paper.entity';
import { UpdateQuestionPaperDto } from '../dto/question-paper/update-question-paper.dto';
import { QuestionPaperResponseDto } from '../dto/question-paper/response-question-paper.dto';

@Injectable()
export class QuestionPaperService {
  constructor(
    private readonly questionPaperRepository: QuestionPaperRepository,
  ) {}

  async getQuestionPaperById(
    questionPaperId: string,
  ): Promise<QuestionPaperResponseDto> {
    const {
      id,
      name,
      owner,
      createdOn,
      candidates,
      textQuestions,
      mcqQuestions,
      numericalQuestions,
    } =
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId);
    return {
      id,
      name,
      owner,
      createdOn,
      candidates,
      questions: [...textQuestions, ...mcqQuestions, ...numericalQuestions],
    };
  }

  async createQuestionPaper(
    createQuestionPaperDto: CreateQuestionPaperDto,
    user: User,
  ): Promise<QuestionPaper> {
    return await this.questionPaperRepository.createQuestionPaper(
      createQuestionPaperDto,
      user,
    );
  }

  async updateQuestionPaper(
    questionPaperId: string,
    updateQuestionPaperDto: UpdateQuestionPaperDto,
  ): Promise<QuestionPaper> {
    const { name } = updateQuestionPaperDto;

    const questionPaper =
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId);

    if (name) {
      questionPaper.name = name;
    } else {
      throw new BadRequestException('no change implemented');
    }

    return await this.questionPaperRepository.save(questionPaper);
  }
}
