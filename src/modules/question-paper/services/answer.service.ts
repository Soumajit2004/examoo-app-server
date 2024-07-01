import { BadRequestException, Injectable } from '@nestjs/common';
import { AddAnswerDto } from '../dto/question/add-answer.dto';
import { User } from '../../../common/database/entites/user.entity';
import { McqQuestion } from '../../../common/database/entites/question-paper/question/mcq-question.entity';
import { TextQuestion } from '../../../common/database/entites/question-paper/question/text-question.entity';
import { NumericalQuestion } from '../../../common/database/entites/question-paper/question/numerical-question.entity';
import { McqQuestionRepository } from '../../../common/database/repositories/question-paper/question/mcq-question.repository';
import { NumericalQuestionRepository } from '../../../common/database/repositories/question-paper/question/numerical-question.repository';
import { TextQuestionRepository } from '../../../common/database/repositories/question-paper/question/text-question.repository';
import { McqOptionRepository } from '../../../common/database/repositories/question-paper/question/mcq-option.repository';
import { QuestionService } from './question.service';

@Injectable()
export class AnswerService {
  constructor(
    private readonly mcqQuestionRepository: McqQuestionRepository,
    private readonly numericalQuestionRepository: NumericalQuestionRepository,
    private readonly textQuestionRepository: TextQuestionRepository,
    private readonly mcqOptionRepository: McqOptionRepository,
    private readonly questionService: QuestionService,
  ) {}

  async addAnswer(
    questionPaperId: string,
    questionId: string,
    addAnswerDto: AddAnswerDto,
    user: User,
  ): Promise<McqQuestion | TextQuestion | NumericalQuestion> {
    const question = await this.questionService.getQuestionById(
      questionPaperId,
      questionId,
      user,
    );

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
    }

    throw new BadRequestException('question type and answer mismatch');
  }

  async removeAnswer(questionPaperId: string, questionId: string, user: User) {
    const question = await this.questionService.getQuestionById(
      questionPaperId,
      questionId,
      user,
    );

    if (question instanceof McqQuestion) {
      await this.mcqQuestionRepository.removeAnswer(question);
    } else if (question instanceof NumericalQuestion) {
      await this.numericalQuestionRepository.removeAnswer(question);
    } else if (question instanceof TextQuestion) {
      await this.textQuestionRepository.removeAnswer(question);
    }
  }
}
