import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { QuestionPaper } from '../../../entites/question-paper/question-paper.entity';
import { TextQuestion } from '../../../entites/question-paper/question/text-question.entity';
import { CreateQuestionDto } from '../../../../../modules/question-paper/dto/question/create-question.dto';

@Injectable()
export class TextQuestionRepository extends Repository<TextQuestion> {
  constructor(private dataSource: DataSource) {
    super(TextQuestion, dataSource.createEntityManager());
  }

  async createTextQuestion(
    questionPaper: QuestionPaper,
    createQuestionDto: CreateQuestionDto,
  ): Promise<TextQuestion> {
    const { questionText, questionType } = createQuestionDto;

    const question = this.create({
      questionText,
      questionType,
      parentQuestionPaper: questionPaper,
    });

    return await this.save(question);
  }

  async addAnswer(textQuestion: TextQuestion, correctAnswer: string) {
    textQuestion.answerAdded = true;
    textQuestion.answer = correctAnswer;

    return await this.save(textQuestion);
  }

  async removeAnswer(textQuestion: TextQuestion) {
    textQuestion.answerAdded = false;
    textQuestion.answer = null;

    return await this.save(textQuestion);
  }
}
