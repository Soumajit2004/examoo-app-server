import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateQuestionPaperDto } from '../dto/question-paper/create-question-paper.dto';
import { UpdateQuestionPaperDto } from '../dto/question-paper/update-question-paper.dto';
import { QuestionPaperResponseDto } from '../dto/question-paper/response-question-paper.dto';
import { QuestionPaperRepository } from '../../../common/database/repositories/question-paper/question-paper.repository';
import { QuestionPaper } from '../../../common/database/entites/question-paper/question-paper.entity';
import { User } from '../../../common/database/entites/user.entity';

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

  async deleteQuestionPaper(
    questionPaperId: string,
    user: User,
  ): Promise<void> {
    const questionPaper = await this.getQuestionPaperById(
      questionPaperId,
      user,
    );

    await this.questionPaperRepository.remove(questionPaper);
  }
}
