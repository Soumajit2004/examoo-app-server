import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../user/entites/user.entity';

@Controller('question-paper/:questionPaperId/question')
@UseGuards(AuthGuard())
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('/:questionId')
  getQuestionById(@Param('questionId') questionId: string) {
    return this.questionService.getQuestionById(questionId);
  }

  @Post('/new')
  createQuestionPaper(
    @Param('questionPaperId') questionPaperId: string,
    @Body() createQuestionDto: CreateQuestionDto,
    @GetUser() user: User,
  ) {
    return this.questionService.createQuestionPaper(
      questionPaperId,
      createQuestionDto,
      user,
    );
  }
}
