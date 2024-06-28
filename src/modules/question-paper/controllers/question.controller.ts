import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../user/entites/user.entity';
import { McqQuestion } from '../entites/mcq-question.entity';
import { NumericalQuestion } from '../entites/numerical-question.entity';
import { TextQuestion } from '../entites/text-question.entity';
import { AddMcqOptionDto } from '../dto/question/add-mcq-option.dto';

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

  @Patch(':questionId/mcq/option')
  async addMcqOption(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @Body() addMcqOptionDto: AddMcqOptionDto,
    @GetUser() user: User,
  ): Promise<McqQuestion> {
    return await this.questionService.addMcqOption(
      questionPaperId,
      questionId,
      addMcqOptionDto,
      user,
    );
  }
}
