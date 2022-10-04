import { EntityRepository, Repository } from 'typeorm';
import { NotesEntity } from '../entities/notes.entity';
@EntityRepository(NotesEntity)
export class NotesRepository extends Repository<NotesEntity> {}
