import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Menu } from './menu.entity';

@Entity()
export class AddOn {
  @PrimaryGeneratedColumn()
  add_on_id: number;

  @Column()
  add_on_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Menu, (menu) => menu.addOns, { nullable: false })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;
}
