import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { QuestionPaper } from '../../../entites/question-paper/question-paper.entity';
import { NumericalQuestion } from '../../../entites/question-paper/question/numerical-question.entity';
import { CreateQuestionDto } from '../../../../../modules/question-paper/dto/question/create-question.dto';

@Injectable()
export class NumericalQuestionRepository extends Repository<NumericalQuestion> {
  constructor(private dataSource: DataSource) {
    super(NumericalQuestion, dataSource.createEntityManager());
  }

  async createNumericalQuestion(
    questionPaper: QuestionPaper,
    createQuestionDto: CreateQuestionDto,
  ): Promise<NumericalQuestion> {
    const { questionText, questionType } = createQuestionDto;

    const question = this.create({
      questionText,
      questionType,
      parentQuestionPaper: questionPaper,
    });

    return await this.save(question);
  }
  async addAnswer(numericalQuestion: NumericalQuestion, correctAnswer: number) {
    numericalQuestion.answerAdded = true;
    numericalQuestion.answer = correctAnswer;

    return await this.save(numericalQuestion);
  }

  async removeAnswer(numericalQuestion: NumericalQuestion) {
    numericalQuestion.answerAdded = false;
    numericalQuestion.answer = null;

    return await this.save(numericalQuestion);
  }
}
