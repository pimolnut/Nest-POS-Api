import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../ormconfig';
import { OrderModule } from './employee-side/order/order.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner-side/owner/owner.module';
import { MenuModule } from './owner-side/menus/menu.module';
import { CategoryModule } from './owner-side/category/category.module';
import { BranchModule } from './owner-side/branch/branch.module';
import { DashboardModule } from './owner-side/stock/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    OrderModule,
    AuthModule,
    OwnerModule,
    MenuModule,
    CategoryModule,
    BranchModule,
    DashboardModule,
  ],
})
export class AppModule {}
