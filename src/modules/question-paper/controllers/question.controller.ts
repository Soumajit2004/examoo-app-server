import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/question/create-mcq-question.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../user/entites/user.entity';
import { McqQuestion } from '../entites/mcq-question.entity';
import { NumericalQuestion } from '../entites/numerical-question.entity';
import { TextQuestion } from '../entites/text-question.entity';

@Controller('question-paper/:questionPaperId/question')
@UseGuards(AuthGuard())
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('/:questionId')
  getQuestionById(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @GetUser() user: User,
  ) {
    return this.questionService.getQuestionById(
      questionId,
      questionPaperId,
      user,
    );
  }

  @Post('/new')
  createQuestion(
    @Param('questionPaperId') questionPaperId: string,
    @Body() createQuestionDto: CreateQuestionDto,
    @GetUser() user: User,
  ): Promise<McqQuestion | NumericalQuestion | TextQuestion> {
    return this.questionService.createQuestion(
      questionPaperId,
      createQuestionDto,
      user,
    );
  }
}
