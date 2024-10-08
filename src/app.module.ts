import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../ormconfig';  
import { OrderModule } from './order/order.module';  
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  
    }),
    TypeOrmModule.forRoot(typeOrmConfig),  
    OrderModule, AuthModule, OwnerModule,
  ],
})
export class AppModule {}
