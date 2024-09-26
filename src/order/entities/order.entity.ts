import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CancelStatus } from '../dto/create-order/create-order.dto'; 

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column()
  customer_id: number;

  @Column({ type: 'timestamp' })
  order_date: Date;

  @Column()
  total_price: number;

  @Column()
  queue_number: number;

  @Column()
  status: string;

  @Column({
    type: 'enum',
    enum: CancelStatus,
    default: CancelStatus.RefundPending,
  })
  cancel_status: CancelStatus;
}
