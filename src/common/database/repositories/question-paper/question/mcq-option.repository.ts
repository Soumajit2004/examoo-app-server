import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { McqQuestion } from '../../../entites/question-paper/question/mcq-question.entity';
import { McqOption } from '../../../entites/question-paper/question/mcq-option.entity';

@Injectable()
export class McqOptionRepository extends Repository<McqOption> {
  constructor(private dataSource: DataSource) {
    super(McqQuestion, dataSource.createEntityManager());
  }
}
