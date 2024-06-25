import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateQuestionPaperDto } from '../dto/create-question-paper.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../user/entites/user.entity';
import { QuestionPaperService } from '../services/question-paper.service';
import { QuestionPaper } from '../entites/question-paper.entity';

@Controller('question-paper')
@UseGuards(AuthGuard())
export class QuestionPaperController {
  constructor(private readonly questionPaperService: QuestionPaperService) {}

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
}
