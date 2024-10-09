import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Menu } from '../../../menu/entities/menu.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  category_name: string;

  @OneToMany(() => Menu, (menu) => menu.category)
  menus: Menu[];
}
