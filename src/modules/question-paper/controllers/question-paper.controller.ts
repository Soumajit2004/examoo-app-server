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

import { CreateQuestionPaperDto } from '../dto/question-paper/create-question-paper.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../user/entites/user.entity';
import { QuestionPaperService } from '../services/question-paper.service';
import { QuestionPaper } from '../entites/question-paper.entity';
import { UpdateQuestionPaperDto } from '../dto/question-paper/update-question-paper.dto';
import { QuestionPaperAccessControlService } from '../services/question-paper-access-control.service';
import { QuestionPaperResponseDto } from '../dto/question-paper/response-question-paper.dto';

@Controller('question-paper')
@UseGuards(AuthGuard())
export class QuestionPaperController {
  constructor(
    private readonly questionPaperService: QuestionPaperService,
    private readonly questionPaperAccessControlService: QuestionPaperAccessControlService,
  ) {}

  @Get('/:questionPaperId')
  async getQuestionPaperById(
    @Param('questionPaperId') questionPaperId: string,
    @GetUser() user: User,
  ): Promise<QuestionPaperResponseDto> {
    if (
      await this.questionPaperAccessControlService.verifyReadAccessOrFail(
        questionPaperId,
        user,
      )
    ) {
      return this.questionPaperService.getQuestionPaperById(questionPaperId);
    }

    throw new ForbiddenException(
      `no read privileges to question paper with id:${questionPaperId}`,
    );
  }

  @Post('/new')
  createQuestionPaper(
    @Body() createQuestionPaperDto: CreateQuestionPaperDto,
    @GetUser() user: User,
  ): Promise<QuestionPaper> {
    return this.questionPaperService.createQuestionPaper(
      createQuestionPaperDto,
      user,
    );
  }

  @Patch('/:questionPaperId')
  async updateQuestionPaper(
    @Param('questionPaperId') questionPaperId: string,
    @Body() updateQuestionPaperDto: UpdateQuestionPaperDto,
    @GetUser() user: User,
  ): Promise<QuestionPaper> {
    if (
      await this.questionPaperAccessControlService.verifyOwnerAccessOrFail(
        questionPaperId,
        user,
      )
    ) {
      return this.questionPaperService.updateQuestionPaper(
        questionPaperId,
        updateQuestionPaperDto,
      );
    }

    throw new ForbiddenException(
      `no owner privileges to question paper with id:${questionPaperId}`,
    );
  }
}
