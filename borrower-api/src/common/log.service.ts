import { Injectable } from '@nestjs/common';
import { LogEntity } from '../entities/log.entity';
import { LogRepository } from '../repository/log.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogRepository)
    private readonly logRepository: LogRepository,
  ) {}

  async addLogs(loanId, message) {
    const logEntity = new LogEntity();
    logEntity.loan_id = loanId;
    logEntity.module = message;

    this.logRepository.save(logEntity);
  }

  async getLogs(loanId) {
    return this.logRepository.find({ loan_id: loanId });
  }

  async errorLogs(loanId, message, error) {
    const logEntity = new LogEntity();
    logEntity.loan_id = loanId;
    logEntity.error = error;
    logEntity.module = message;

    this.logRepository.save(logEntity);
  }
}
