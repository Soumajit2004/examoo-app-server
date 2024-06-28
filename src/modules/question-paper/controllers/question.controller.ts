import {
  Body,
  Controller,
  ForbiddenException,
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
import { QuestionPaperAccessControlService } from '../services/question-paper-access-control.service';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';

@Controller('question-paper/:questionPaperId/question')
@UseGuards(AuthGuard())
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly questionPaperAccessControlService: QuestionPaperAccessControlService,
  ) {}

  @Get('/:questionId')
  async getQuestionById(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @GetUser() user: User,
  ) {
    if (
      await this.questionPaperAccessControlService.verifyReadAccessOrFail(
        questionPaperId,
        user,
      )
    ) {
      return this.questionService.getQuestionById(questionId);
    }

    throw new ForbiddenException(
      `no read privileges to question paper with id:${questionPaperId}`,
    );
  }

  @Post('/new')
  async createQuestion(
    @Param('questionPaperId') questionPaperId: string,
    @Body() createQuestionDto: CreateQuestionDto,
    @GetUser() user: User,
  ): Promise<McqQuestion | NumericalQuestion | TextQuestion> {
    if (
      await this.questionPaperAccessControlService.verifyOwnerAccessOrFail(
        questionPaperId,
        user,
      )
    ) {
      return this.questionService.createQuestion(
        questionPaperId,
        createQuestionDto,
      );
    }

    throw new ForbiddenException(
      `no create privileges to question paper with id:${questionPaperId}`,
    );
  }

  @Patch('/:questionId')
  async updateQuestion(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @GetUser() user: User,
  ) {
    if (
      await this.questionPaperAccessControlService.verifyOwnerAccessOrFail(
        questionPaperId,
        user,
      )
    ) {
      return this.questionService.updateQuestion(questionId, updateQuestionDto);
    }

    throw new ForbiddenException(
      `no update privileges to question paper with id:${questionPaperId}`,
    );
  }

  @Patch(':questionId/mcq/option')
  async addMcqOption(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @Body() addMcqOptionDto: AddMcqOptionDto,
    @GetUser() user: User,
  ): Promise<McqQuestion> {
    if (
      await this.questionPaperAccessControlService.verifyOwnerAccessOrFail(
        questionPaperId,
        user,
      )
    ) {
      return this.questionService.addMcqOption(questionId, addMcqOptionDto);
    }

    throw new ForbiddenException(
      `no update privileges to question paper with id:${questionPaperId}`,
    );
  }

  @Patch(':questionId/answer')
  async addAnswer(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @Body() addAnswerDto: AddAnswerDto,
    @GetUser() user: User,
  ): Promise<McqQuestion | TextQuestion | NumericalQuestion> {
    if (
      await this.questionPaperAccessControlService.verifyOwnerAccessOrFail(
        questionPaperId,
        user,
      )
    ) {
      return this.questionService.addAnswer(questionId, addAnswerDto);
    }

    throw new ForbiddenException(
      `no update privileges to question paper with id:${questionPaperId}`,
    );
  }
}
