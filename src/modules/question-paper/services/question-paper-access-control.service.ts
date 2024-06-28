import { Injectable } from '@nestjs/common';

import { User } from '../../user/entites/user.entity';
import { QuestionPaperRepository } from '../../../database/repositories/question-paper.repository';

@Injectable()
export class QuestionPaperAccessControlService {
  constructor(
    private readonly questionPaperRepository: QuestionPaperRepository,
  ) {}
  async verifyReadAccessOrFail(
    questionPaperId: string,
    user: User,
  ): Promise<boolean> {
    const questionPaper =
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId);

    let found = false;

    questionPaper.candidates.forEach((u) => {
      u.id === user.id ? (found = true) : null;
    });

    return !!found;
  }

  async verifyOwnerAccessOrFail(
    questionPaperId: string,
    user: User,
  ): Promise<boolean> {
    const questionPaper =
      await this.questionPaperRepository.getQuestionPaperById(questionPaperId);

    return questionPaper.owner.id === user.id;
  }
}
