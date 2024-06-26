import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import {
  Question,
  QuestionType,
} from '../../modules/question-paper/entites/question.entity';
import { CreateQuestionDto } from '../../modules/question-paper/dto/question/create-question.dto';
import { QuestionPaper } from '../../modules/question-paper/entites/question-paper.entity';
import { TextAnswer } from '../../modules/question-paper/entites/answers/text/text-answer.entity';

@Injectable()
export class QuestionRepository extends Repository<Question> {
  constructor(private dataSource: DataSource) {
    super(Question, dataSource.createEntityManager());
  }

  async getQuestionById(questionId: string) {
    const found = await this.findOneBy({ id: questionId });

    if (!found) {
      throw new NotFoundException(
        `unable to find question with id:${questionId}`,
      );
    }

    return found;
  }

  async createQuestion(
    questionPaper: QuestionPaper,
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const { questionText, questionType } = createQuestionDto;

    const question = this.create({
      questionText,
      questionType,
      parentQuestionPaper: questionPaper,
    });

    return await this.save(question);
  }

  async bindAnswer({
    question,
    textAnswer,
  }: {
    question: Question;
    textAnswer?: TextAnswer;
  }) {
    if (question.questionType === QuestionType.TEXT && textAnswer) {
      question.textAnswer = textAnswer;
    } else {
      throw new BadRequestException('question type and answer mismatch');
    }

    question.answerAdded = true;
    return await this.save(question);
  }
}
