import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Menu } from './menu.entity';

@Entity()
export class SweetnessLevel {
  @PrimaryGeneratedColumn()
  sweetness_id: number;

  @Column({ nullable: false })
  level_name: string;

  // @ManyToOne(() => Menu, (menu) => menu.sweetnessLevels, {
  //   nullable: false,
  //   onDelete: 'CASCADE',
  // })
  @ManyToOne(() => Menu, (menu) => menu.sweetnessLevels, { nullable: false })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;
}
