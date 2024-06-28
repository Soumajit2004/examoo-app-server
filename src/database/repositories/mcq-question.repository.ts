import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { McqQuestion } from '../../modules/question-paper/entites/mcq-question.entity';
import { QuestionPaper } from '../../modules/question-paper/entites/question-paper.entity';
import { CreateQuestionDto } from '../../modules/question-paper/dto/question/create-question.dto';
import { AddMcqOptionDto } from '../../modules/question-paper/dto/question/add-mcq-option.dto';
import { McqOption } from '../../modules/question-paper/entites/mcq-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class McqQuestionRepository extends Repository<McqQuestion> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(McqOption)
    private mcqOptionRepository: Repository<McqOption>,
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

    return await this.save(mcqQuestion);
  }
}
