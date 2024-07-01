import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { McqQuestion } from '../../../entites/question-paper/question/mcq-question.entity';
import { QuestionPaper } from '../../../entites/question-paper/question-paper.entity';
import { McqOption } from '../../../entites/question-paper/question/mcq-option.entity';
import { CreateQuestionDto } from '../../../../../modules/question-paper/dto/question/create-question.dto';
import { AddMcqOptionDto } from '../../../../../modules/question-paper/dto/question/add-mcq-option.dto';
import { McqOptionRepository } from './mcq-option.repository';

@Injectable()
export class McqQuestionRepository extends Repository<McqQuestion> {
  logger = new Logger();

  constructor(
    private dataSource: DataSource,
    private readonly mcqOptionRepository: McqOptionRepository,
  ) {
    super(McqQuestion, dataSource.createEntityManager());
  }

  async createMcqQuestion(
    questionPaper: QuestionPaper,
    createQuestionDto: CreateQuestionDto,
  ): Promise<McqQuestion> {
    const { questionText, questionType } = createQuestionDto;

    const question = this.create({
      questionText,
      questionType,
      parentQuestionPaper: questionPaper,
    });

    return await this.save(question);
  }

  async addMcqOption(
    mcqQuestion: McqQuestion,
    addMcqOptionDto: AddMcqOptionDto,
  ) {
    const { text } = addMcqOptionDto;

    const option = this.mcqOptionRepository.create({
      text,
    });

    mcqQuestion.mcqOptions = [option, ...mcqQuestion.mcqOptions];

    await this.mcqOptionRepository.save(option);
    await this.save(mcqQuestion);

    return option;
  }

  async addAnswer(mcqQuestion: McqQuestion, correctOption: McqOption) {
    let includesInOption = false;

    mcqQuestion.mcqOptions.forEach((option) => {
      if (option.id === correctOption.id) {
        includesInOption = true;
      }
    });

    if (!includesInOption) {
      throw new BadRequestException(
        `${mcqQuestion.id} does not include option ${correctOption.id} `,
      );
    }

    mcqQuestion.answerAdded = true;
    mcqQuestion.answer = correctOption.id;

    return await this.save(mcqQuestion);
  }

  async removeAnswer(mcqQuestion: McqQuestion) {
    mcqQuestion.answerAdded = false;
    mcqQuestion.answer = null;

    return await this.save(mcqQuestion);
  }
}
