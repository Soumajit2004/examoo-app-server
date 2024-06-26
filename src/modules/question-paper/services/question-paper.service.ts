import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { QuestionPaperRepository } from '../../../database/repositories/question-paper.repository';
import { CreateQuestionPaperDto } from '../dto/question-paper/create-question-paper.dto';
import { User } from '../../user/entites/user.entity';
import { QuestionPaper } from '../entites/question-paper.entity';
import { UpdateQuestionPaperDto } from '../dto/question-paper/update-question-paper.dto';

@Injectable()
export class QuestionPaperService {
  constructor(
    private readonly questionPaperRepository: QuestionPaperRepository,
  ) {}

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
        `unable to find question paper with id: ${questionPaperId}`,
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
    const { name } = updateQuestionPaperDto;

    const questionPaper = await this.getQuestionPaperById(
      questionPaperId,
      user,
    );

    if (name) {
      questionPaper.name = name;
    } else {
      throw new BadRequestException('no change implemented');
    }

    return await this.questionPaperRepository.save(questionPaper);
  }
}
