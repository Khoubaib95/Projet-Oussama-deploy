import { Module } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CategorieController } from './categorie.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/categorie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '60h' },
    }),
  ],
  controllers: [CategorieController],
  providers: [CategorieService],
})
export class CategorieModule {}
