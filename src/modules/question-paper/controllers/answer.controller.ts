import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateTextAnswerDto } from '../dto/answer/text/create-text-answer.dto';
import { AnswerService } from '../services/answer.service';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../user/entites/user.entity';
import { Question, QuestionType } from '../entites/question.entity';

@Controller('question-paper/:questionPaperId/question/:questionId/answer')
@UseGuards(AuthGuard())
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('/:questionType')
  createAnswer(
    @Param('questionType') questionType: QuestionType,
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @Body() createTextAnswerDto: CreateTextAnswerDto,
    @GetUser() user: User,
  ): Promise<Question> {
    switch (questionType) {
      case QuestionType.MCQ:
        return this.answerService.createTextAnswer(
          questionPaperId,
          questionId,
          createTextAnswerDto,
          user,
        );
      default:
        throw new BadRequestException('invalid answer type');
    }
  }
}
