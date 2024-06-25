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

import { CreateQuestionPaperDto } from '../dto/create-question-paper.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../user/entites/user.entity';
import { QuestionPaperService } from '../services/question-paper.service';
import { QuestionPaper } from '../entites/question-paper.entity';
import { UpdateQuestionPaperDto } from '../dto/update-question-paper.dto';

@Controller('question-paper')
@UseGuards(AuthGuard())
export class QuestionPaperController {
  constructor(private readonly questionPaperService: QuestionPaperService) {}

  @Get('/:questionPaperId')
  getQuestionPaperById(
    @Param('questionPaperId') questionPaperId: string,
    @GetUser() user: User,
  ): Promise<QuestionPaper> {
    return this.questionPaperService.getQuestionPaperById(
      questionPaperId,
      user,
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
  updateQuestionPaper(
    @Param('questionPaperId') questionPaperId: string,
    @Body() updateQuestionPaperDto: UpdateQuestionPaperDto,
    @GetUser() user: User,
  ): Promise<QuestionPaper> {
    return this.questionPaperService.updateQuestionPaper(
      questionPaperId,
      updateQuestionPaperDto,
      user,
    );
  }
}