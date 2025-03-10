import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tema } from '../../tema/entities/tema.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_postagens' }) // CREATE TABLE tb_postagens()
export class Postagem {
  @PrimaryGeneratedColumn()
  @ApiProperty() // AUTO_INCREMENT PRIMARY KEY
  id: number;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty() // VALIDACAO DOS DADOS DO OBJETO
  @Column({ length: 100, nullable: false })
  @ApiProperty() // VARCHAR(100) NOT NULL
  titulo: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty() // VALIDACAO DOS DADOS DO OBJETO
  @Column({ length: 1000, nullable: false }) // VARCHAR(1000) NOT NULL
  @ApiProperty()
  texto: string;

  @UpdateDateColumn()
  @ApiProperty() // Atualiza a data e hora toda vez que eu mudar uma informação no objeto
  data: Date;

  @ApiProperty({ type: () => Tema })
  @ManyToOne(() => Tema, (tema) => tema.postagem, {
    onDelete: 'CASCADE',
  })
  tema: Tema;

  @ApiProperty({ type: () => Usuario })
  @ManyToOne(() => Usuario, (usuario) => usuario.postagem, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;
}
