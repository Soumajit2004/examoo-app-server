import { BadRequestException, Injectable } from '@nestjs/common';

import { QuestionPaperRepository } from '../../../database/repositories/question-paper.repository';
import { CreateQuestionPaperDto } from '../dto/question-paper/create-question-paper.dto';
import { User } from '../../user/entites/user.entity';
import { QuestionPaper } from '../entites/question-paper.entity';
import { UpdateQuestionPaperDto } from '../dto/question-paper/update-question-paper.dto';
import { QuestionPaperAccessControlService } from './question-paper-access-control.service';

@Injectable()
export class QuestionPaperService {
  constructor(
    private readonly questionPaperRepository: QuestionPaperRepository,
    private readonly questionPaperAccessControlService: QuestionPaperAccessControlService,
  ) {}
  async getQuestionPaperById(
    questionPaperId: string,
    user: User,
  ): Promise<QuestionPaper> {
    const questionPaper =
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId);

    await this.questionPaperAccessControlService.verifyReadAccessOrFail(
      questionPaper,
      user,
    );

    return questionPaper;
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

    const questionPaper =
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId);

    await this.questionPaperAccessControlService.verifyOwnerAccessOrFail(
      questionPaper,
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
