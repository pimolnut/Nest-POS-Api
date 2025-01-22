import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Menu } from 'src/owner-side/menus/entities/menu.entity';
import { MenuType } from 'src/owner-side/menus/entities/menu-type.entity';
import { AddOn } from 'src/owner-side/menus/entities/add-on.entity';
import { Size } from 'src/owner-side/menus/entities/size.entity';
import { SweetnessLevel } from 'src/owner-side/menus/entities/sweetness-level.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  order_item_id: number;

  @ManyToOne(() => Order, { nullable: null })
  @JoinColumn({ name: 'order_id' })
  order_id: Order;

  //menu_id link with table menu
  @ManyToOne(() => Menu, { nullable: null })
  @JoinColumn({ name: 'menu_id' })
  menu_id: Menu;

  //sweetness_id link with table sweetness
  @ManyToOne(() => SweetnessLevel, { nullable: null })
  @JoinColumn({ name: 'sweetness_id' })
  sweetness_id: SweetnessLevel;

  //MenuType_id link with table type
  @ManyToOne(() => MenuType, { nullable: null })
  @JoinColumn({ name: 'menu_type_id' })
  menu_type_id: MenuType;

  //add_on_id link with table add on
  @ManyToOne(() => AddOn, { nullable: null })
  @JoinColumn({ name: 'add_on_id' })
  add_on_id: AddOn[];

  //size_id link with table size
  @ManyToOne(() => Size, { nullable: null })
  @JoinColumn({ name: 'size_id' })
  size_id: Size;

  @Column()
  quantity: number; //จำนวนสินค้าที่เพิ่ม

  @Column()
  price: number; //ราคา
}
