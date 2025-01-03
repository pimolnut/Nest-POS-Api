import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Menu } from '../../menus/entities/menu.entity';

@Entity()
export class Topping {
  @PrimaryGeneratedColumn()
  topping_id: number;

  @Column()
  topping_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Menu, (menu) => menu.toppings)
  menu: Menu;
}
