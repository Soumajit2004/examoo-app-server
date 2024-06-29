import {
  Body,
  Controller,
  Delete,
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
import { AddAnswerDto } from '../dto/question/add-answer.dto';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';

@Controller('question-paper/:questionPaperId/question')
@UseGuards(AuthGuard())
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('/:questionId')
  async getQuestionById(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @GetUser() user: User,
  ) {
    return this.questionService.getQuestionById(
      questionPaperId,
      questionId,
      user,
    );
  }

  @Post('/new')
  async createQuestion(
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

  @Patch('/:questionId')
  async updateQuestion(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @GetUser() user: User,
  ) {
    return this.questionService.updateQuestion(
      questionPaperId,
      questionId,
      updateQuestionDto,
      user,
    );
  }

  @Delete('/:questionId')
  async deleteQuestion(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @GetUser() user: User,
  ) {
    return this.questionService.deleteQuestion(
      questionPaperId,
      questionId,
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
    return this.questionService.addMcqOption(
      questionPaperId,
      questionId,
      addMcqOptionDto,
      user,
    );
  }

  @Patch(':questionId/answer')
  async addAnswer(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @Body() addAnswerDto: AddAnswerDto,
    @GetUser() user: User,
  ): Promise<McqQuestion | TextQuestion | NumericalQuestion> {
    return this.questionService.addAnswer(
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
    return this.questionService.removeAnswer(questionPaperId, questionId, user);
  }
}
