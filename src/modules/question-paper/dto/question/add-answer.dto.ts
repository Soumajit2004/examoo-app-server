import { IsDecimal, IsOptional, IsString, IsUUID } from 'class-validator';

export class AddAnswerDto {
  @IsOptional()
  @IsString()
  textAnswer?: string;

  @IsOptional()
  @IsDecimal()
  numericalAnswer?: number;

  @IsOptional()
  @IsUUID()
  mcqOptionId?: string;
}
