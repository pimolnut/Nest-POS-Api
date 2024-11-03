import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Menus } from '../../../menus/entities/menus.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  category_name: string;

  @OneToMany(() => Menus, (menus) => menus.category)
  menus: Menus[];
}
