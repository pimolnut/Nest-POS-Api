import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../ormconfig';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';
import { MenuModule } from './menus/menu.module';
import { CategoryModule } from './category/category.module';
import { BranchModule } from './branch/branch.module';
import { SizeModule } from './size/size.module';
import { ToppingModule } from './topping/topping.module';
import { SweetnessLevelModule } from './sweet_level/sweetness-level.module';
import { MenuOptionsModule } from './menu-options/menu-options.module';

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
    SizeModule,
    ToppingModule,
    SweetnessLevelModule,
    MenuOptionsModule,
  ],
})
export class AppModule {}
