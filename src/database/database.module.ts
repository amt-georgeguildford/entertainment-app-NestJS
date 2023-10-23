import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
  imports: [PrismaModule]
})
export class DatabaseModule {}
