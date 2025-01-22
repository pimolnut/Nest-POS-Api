import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Owner } from '../../owner/entities/owner/owner.entity';
import { Category } from '../../category/entities/category/category.entity';
import { Branch } from '../../branch/entities/branch/branch.entity';
import { Size } from 'src/owner-side/menus/entities/size.entity';
import { AddOn } from 'src/owner-side/menus/entities/add-on.entity';
import { SweetnessLevel } from 'src/owner-side/menus/entities/sweetness-level.entity';
import { MenuType } from './menu-type.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  menu_id: number;

  @Column()
  store_id: number;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  menu_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Owner, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: Owner;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ nullable: true })
  image_url: string;

  @OneToMany(() => Size, (size) => size.menu, { cascade: true })
  sizes: Size[];

  @OneToMany(() => AddOn, (addOn) => addOn.menu, { cascade: true })
  addOns: AddOn[]; // เพิ่มความสัมพันธ์กับ AddOn

  @OneToMany(() => SweetnessLevel, (sweetnessLevel) => sweetnessLevel.menu)
  sweetnessLevels: SweetnessLevel[]; //

  @OneToMany(() => MenuType, (menuType) => menuType.menu)
  menuTypes: MenuType[];
}
