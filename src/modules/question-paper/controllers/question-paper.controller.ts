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

import { CreateQuestionPaperDto } from '../dto/question-paper/create-question-paper.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../user/entites/user.entity';
import { QuestionPaperService } from '../services/question-paper.service';
import { UpdateQuestionPaperDto } from '../dto/question-paper/update-question-paper.dto';
import { QuestionPaperResponseDto } from '../dto/question-paper/response-question-paper.dto';

@Controller('question-paper')
@UseGuards(AuthGuard())
export class QuestionPaperController {
  constructor(private readonly questionPaperService: QuestionPaperService) {}

  @Get('/:questionPaperId')
  async getQuestionPaperById(
    @Param('questionPaperId') questionPaperId: string,
    @GetUser() user: User,
  ): Promise<QuestionPaperResponseDto> {
    return this.questionPaperService.formatQuestionPaperResponse(
      await this.questionPaperService.getQuestionPaperById(
        questionPaperId,
        user,
      ),
    );
  }

  @Post('/new')
  async createQuestionPaper(
    @Body() createQuestionPaperDto: CreateQuestionPaperDto,
    @GetUser() user: User,
  ): Promise<QuestionPaperResponseDto> {
    return this.questionPaperService.formatQuestionPaperResponse(
      await this.questionPaperService.createQuestionPaper(
        createQuestionPaperDto,
        user,
      ),
    );
  }

  @Patch('/:questionPaperId')
  async updateQuestionPaper(
    @Param('questionPaperId') questionPaperId: string,
    @Body() updateQuestionPaperDto: UpdateQuestionPaperDto,
    @GetUser() user: User,
  ): Promise<QuestionPaperResponseDto> {
    return this.questionPaperService.formatQuestionPaperResponse(
      await this.questionPaperService.updateQuestionPaper(
        questionPaperId,
        updateQuestionPaperDto,
        user,
      ),
    );
  }

  @Delete('/:questionPaperId')
  deleteQuestionPaper(
    @Param('questionPaperId') questionPaperId: string,
    @GetUser() user: User,
  ) {
    return this.questionPaperService.deleteQuestionPaper(questionPaperId, user);
  }
}
