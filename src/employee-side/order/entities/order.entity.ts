// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// import { CancelStatus } from '../dto/create-order/create-order.dto';

// @Entity()
// export class Order {
//   @PrimaryGeneratedColumn()
//   order_id: number;

//   @Column()
//   customer_id: number;

//   @Column({ type: 'timestamp' })
//   order_date: Date;

//   @Column()
//   total_price: number;

//   @Column()
//   queue_number: number;

//   @Column()
//   status: string;

//   @Column({
//     type: 'enum',
//     enum: CancelStatus,
//     default: CancelStatus.RefundPending,
//   })
//   cancel_status: CancelStatus;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { CancelStatus } from '../dto/create-order/create-order.dto';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @CreateDateColumn()
  order_date: Date;

  @Column()
  queue_number: number;

  @Column({ default: 'รอทำ' }) // สถานะเริ่มต้นเป็น "รอทำ"
  status: string;

  @Column({ nullable: true })
  total_price: number;

  @Column({ nullable: true })
  customer_id: number; // ไอดีลูกค้า

  @Column({ nullable: true })
  customer_name: string; // ชื่อลูกค้า

  @Column({ nullable: true })
  contact: string; // เบอร์โทรลูกค้า

  @Column({
    type: 'enum',
    enum: CancelStatus,
    default: CancelStatus.RefundPending,
    nullable: true,
  })
  cancel_status: CancelStatus;
}
