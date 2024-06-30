import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { McqOption } from '../../../entites/question-paper/question/mcq-option.entity';

@Injectable()
export class McqOptionRepository extends Repository<McqOption> {
  constructor(private dataSource: DataSource) {
    super(McqOption, dataSource.createEntityManager());
  }
}
