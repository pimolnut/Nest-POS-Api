import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Owner {
  @PrimaryGeneratedColumn()
  owner_id: number;

  @Column({ type: 'varchar', length: 255 })
  owner_name: string;

  @Column({ type: 'varchar', length: 255 })
  contact_info: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
  // ฟิลด์สำหรับเก็บ OTP
  @Column({ nullable: true })
  otp: string;

  // ฟิลด์สำหรับเก็บเวลาหมดอายุของ OTP
  @Column({ type: 'timestamp', nullable: true })
  otpExpiry: Date;
}
