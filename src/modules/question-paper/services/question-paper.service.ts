import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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

  async verifyReadAccess(
    questionPaperId: string,
    user: User,
  ): Promise<boolean> {
    const questionPaper = await this.questionPaperRepository.findOneBy({
      id: questionPaperId,
    });

    const found = questionPaper.candidates.find((u) => {
      return u.id === user.id;
    });

    if (!found) {
      throw new ForbiddenException(
        `no read access to question paper with id:${questionPaperId}`,
      );
    }

    return !!found;
  }

  async verifyOwnerAccess(
    questionPaperId: string,
    user: User,
  ): Promise<boolean> {
    const hasAccess = await this.questionPaperRepository.findOneBy({
      id: questionPaperId,
      owner: user,
    });

    if (!hasAccess) {
      throw new ForbiddenException(
        `no owner access to question paper with id:${questionPaperId}`,
      );
    }

    return !!hasAccess;
  }

  async getQuestionPaperById(
    questionPaperId: string,
    user: User,
  ): Promise<QuestionPaper> {
    const hasAccess = await this.verifyReadAccess(questionPaperId, user);

    if (!hasAccess) {
      throw new ForbiddenException(
        `no read access to question paper with id: ${questionPaperId}`,
      );
    }

    return this.questionPaperRepository.getQuestionPaperById(questionPaperId);
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
    await this.verifyOwnerAccess(questionPaperId, user);

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
