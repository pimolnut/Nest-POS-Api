import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Menu } from './menu.entity';

@Entity()
export class Size {
  @PrimaryGeneratedColumn()
  size_id: number;

  @Column()
  size_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  size_price: number;

  @ManyToOne(() => Menu, (menu) => menu.sizes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'menu_id' }) // เชื่อมกับคอลัมน์ menu_id ในฐานข้อมูล
  menu: Menu;
}
