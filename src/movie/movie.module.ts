import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [MovieController],
    providers: [MovieService]
})
export class MovieModule {}
