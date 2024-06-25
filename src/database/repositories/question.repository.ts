import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Question } from '../../modules/question-paper/entites/question.entity';

@Injectable()
export class QuestionRepository extends Repository<Question> {
  constructor(private dataSource: DataSource) {
    super(Question, dataSource.createEntityManager());
  }
}
