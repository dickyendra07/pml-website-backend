import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminCataloguesController } from './admin-catalogues.controller';
import { CataloguesController } from './catalogues.controller';
import { CataloguesService } from './catalogues.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CataloguesController, AdminCataloguesController],
  providers: [CataloguesService],
})
export class CataloguesModule {}
