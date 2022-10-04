import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRepository } from '../../repository/roles.repository';
import { RolesmasterRepository } from '../../repository/roleMaster.repository';
import { PortalRepository } from '../../repository/portal.repository';
import { PagetabsRepository } from '../../repository/pagetab.repository';
import { PagesRepository } from '../../repository/page.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RolesRepository,
      RolesmasterRepository,
      PortalRepository,
      PagetabsRepository,
      PagesRepository,
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
