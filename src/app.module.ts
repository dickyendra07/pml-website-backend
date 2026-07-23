import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProposalsModule } from './proposals/proposals.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { PageSeoModule } from './page-seo/page-seo.module';
import { PopupsModule } from './popups/popups.module';
import { CataloguesModule } from './catalogues/catalogues.module';
import { InsightsModule } from './insights/insights.module';
import { HomepageFeaturesModule } from './homepage-features/homepage-features.module';
import { MediaModule } from './media/media.module';
import { CareersModule } from './careers/careers.module';
import { FacilitiesModule } from './facilities/facilities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    ProposalsModule,
    AuthModule,
    SettingsModule,
    PageSeoModule,
    PopupsModule,
    CataloguesModule,
    InsightsModule,
    HomepageFeaturesModule,
    MediaModule,
    CareersModule,
    FacilitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
