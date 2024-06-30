import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { AddMcqOptionDto } from '../dto/question/add-mcq-option.dto';
import { AddAnswerDto } from '../dto/question/add-answer.dto';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';
import { User } from '../../../common/database/entites/user/user.entity';
import { NumericalQuestion } from '../../../common/database/entites/question-paper/question/numerical-question.entity';
import { TextQuestion } from '../../../common/database/entites/question-paper/question/text-question.entity';
import { McqQuestion } from '../../../common/database/entites/question-paper/question/mcq-question.entity';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('imageFile'))
  async createQuestion(
    @Param('questionPaperId') questionPaperId: string,
    @Body() createQuestionDto: CreateQuestionDto,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'image/(jpg|png|jpeg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    imageFile?: Express.Multer.File,
  ): Promise<McqQuestion | NumericalQuestion | TextQuestion> {
    return this.questionService.createQuestion(
      questionPaperId,
      createQuestionDto,
      user,
      imageFile,
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
  @UseInterceptors(FileInterceptor('imageFile'))
  async addMcqOption(
    @Param('questionPaperId') questionPaperId: string,
    @Param('questionId') questionId: string,
    @Body() addMcqOptionDto: AddMcqOptionDto,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'image/(jpg|png|jpeg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    imageFile?: Express.Multer.File,
  ): Promise<McqQuestion> {
    return this.questionService.addMcqOption(
      questionPaperId,
      questionId,
      addMcqOptionDto,
      user,
      imageFile,
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
