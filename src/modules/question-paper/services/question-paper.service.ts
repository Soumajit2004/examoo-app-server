import { Injectable, NotFoundException } from '@nestjs/common';

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

  formatQuestionPaperResponse(
    questionPaper: QuestionPaper,
  ): QuestionPaperResponseDto {
    const response = {
      ...questionPaper,
      questions: [
        ...questionPaper.mcqQuestions,
        ...questionPaper.numericalQuestions,
        ...questionPaper.textQuestions,
      ],
    };

    delete response.textQuestions;
    delete response.mcqQuestions;
    delete response.numericalQuestions;

    return response;
  }

  async getQuestionPaperById(
    questionPaperId: string,
    user: User,
  ): Promise<QuestionPaper> {
    const found = await this.questionPaperRepository.findOneBy({
      id: questionPaperId,
      owner: user,
    });

    if (!found) {
      throw new NotFoundException(
        `question paper with id: ${questionPaperId} not found`,
      );
    }

    return found;
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
    user: User,
  ): Promise<QuestionPaper> {
    const questionPaper = await this.getQuestionPaperById(
      questionPaperId,
      user,
    );

    return await this.questionPaperRepository.updateQuestionPaper(
      questionPaper,
      updateQuestionPaperDto,
    );
  }
}
