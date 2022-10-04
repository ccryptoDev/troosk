import { Drawdown } from 'src/entities/drawdown.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Drawdown)
export class DrawdownRepository extends Repository<Drawdown> {
}
