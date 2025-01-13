import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity({ name: 'tb_postagens' }) // CREATE TABLE tb_postagens()
export class Postagem {
  @PrimaryGeneratedColumn() // AUTO_INCREMENT PRIMARY KEY
  id: number;

  @IsNotEmpty() // VALIDACAO DOS DADOS DO OBJETO
  @Column({ length: 100, nullable: false }) // VARCHAR(100) NOT NULL
  titulo: string;

  @IsNotEmpty() // VALIDACAO DOS DADOS DO OBJETO
  @Column({ length: 1000, nullable: false }) // VARCHAR(1000) NOT NULL
  texto: string;

  @UpdateDateColumn() // Atualiza a data e hora toda vez que eu mudar uma informação no objeto
  data: Date;
}
