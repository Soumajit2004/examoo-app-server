import { ForbiddenException, Injectable } from '@nestjs/common';

import { User } from '../../user/entites/user.entity';
import { QuestionPaper } from '../entites/question-paper.entity';

@Injectable()
export class QuestionPaperAccessControlService {
  async verifyReadAccessOrFail(
    questionPaper: QuestionPaper,
    user: User,
  ): Promise<boolean> {
    let found = false;

    questionPaper.candidates.forEach((u) => {
      u.id === user.id ? (found = true) : null;
    });

    if (!found) {
      throw new ForbiddenException(
        `no read access to question paper with id:${questionPaper.id}`,
      );
    }

    return !!found;
  }

  async verifyOwnerAccessOrFail(
    questionPaper: QuestionPaper,
    user: User,
  ): Promise<boolean> {
    if (questionPaper.owner.id === user.id) {
      return true;
    }

    throw new ForbiddenException(
      `no owner access to question paper with id:${questionPaper.id}`,
    );
  }
}
