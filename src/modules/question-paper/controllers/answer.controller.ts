import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { AddAnswerDto } from '../dto/question/add-answer.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../../common/database/entites/user.entity';
import { McqQuestion } from '../../../common/database/entites/question-paper/question/mcq-question.entity';
import { TextQuestion } from '../../../common/database/entites/question-paper/question/text-question.entity';
import { NumericalQuestion } from '../../../common/database/entites/question-paper/question/numerical-question.entity';
import { AnswerService } from '../services/answer.service';

@Controller('question-paper/:questionPaperId/question')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Patch(':questionId/answer')
  async addAnswer(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @Body() addAnswerDto: AddAnswerDto,
    @GetUser() user: User,
  ): Promise<McqQuestion | TextQuestion | NumericalQuestion> {
    return this.answerService.addAnswer(
      questionPaperId,
      questionId,
      addAnswerDto,
      user,
    );
  }

  @Delete(':questionId/answer')
  deleteAnswer(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @GetUser() user: User,
  ) {
    return this.answerService.removeAnswer(questionPaperId, questionId, user);
  }
}
