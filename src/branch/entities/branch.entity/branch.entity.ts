import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Owner } from '../../../owner/entities/owner/owner.entity';
import { Menu } from '../../../menu/entities/menu.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  branch_id: number;

  @Column()
  branch_name: string;

  @Column()
  branch_address: string;

  @Column()
  branch_phone_number: string;

  @ManyToOne(() => Owner, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: Owner;

  @OneToMany(() => Menu, (menu) => menu.branch)
  menus: Menu[];
}
