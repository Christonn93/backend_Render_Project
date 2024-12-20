import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsEmail, Length } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
    name?: string;

    @Column({ unique: true })
    @IsEmail({}, { message: 'Invalid email address' })
    email?: string;

    @Column({ default: 'default_password' })
    @IsNotEmpty({ message: 'Password is required' })
    password?: string;

    @Column({ default: 'user' })
    role?: string;
}