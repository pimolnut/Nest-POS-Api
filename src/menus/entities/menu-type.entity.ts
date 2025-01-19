import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Menu } from './menu.entity';

@Entity()
export class MenuType {
  @PrimaryGeneratedColumn()
  menu_type_id: number;

  @Column()
  type_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_difference: number;

  @ManyToOne(() => Menu, (menu) => menu.menuTypes)
  menu: Menu;
}
