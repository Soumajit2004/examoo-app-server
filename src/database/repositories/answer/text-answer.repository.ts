import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { TextAnswer } from '../../../modules/question-paper/entites/answers/text/text-answer.entity';
import { CreateTextAnswerDto } from '../../../modules/question-paper/dto/answer/text/create-text-answer.dto';
import { QuestionRepository } from '../question.repository';
import { Question } from '../../../modules/question-paper/entites/question.entity';

@Injectable()
export class TextAnswerRepository extends Repository<TextAnswer> {
  constructor(
    private dataSource: DataSource,
    private readonly questionRepository: QuestionRepository,
  ) {
    super(TextAnswer, dataSource.createEntityManager());
  }

  async createTextAnswer(
    parentQuestion: Question,
    createTextAnswerDto: CreateTextAnswerDto,
  ): Promise<Question> {
    const { correctText } = createTextAnswerDto;

    const answer = this.create({ correctText: correctText });

    return await this.questionRepository.bindAnswer({
      question: parentQuestion,
      textAnswer: answer,
    });
  }
}
