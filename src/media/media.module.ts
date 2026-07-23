import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminMediaController } from './admin-media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminMediaController],
  providers: [MediaService],
})
export class MediaModule {}
