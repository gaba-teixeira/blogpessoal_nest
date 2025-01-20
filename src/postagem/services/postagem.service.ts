import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Postagem } from '../entities/postagem.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { TemaService } from '../../tema/services/tema.service';

@Injectable()
export class PostagemService {
  constructor(
    @InjectRepository(Postagem)
    private postagemRepository: Repository<Postagem>,
    private temaService: TemaService,
  ) {}

  async findAll(): Promise<Postagem[]> {
    return this.postagemRepository.find({
      relations: {
        tema: true,
        usuario: true,
      },
    }); // SELECt * FROM tb_postagem;
  }

  async findById(id: number): Promise<Postagem> {
    // SELECT * FROM tb_postagens WHERE id = ?;
    const postagem = await this.postagemRepository.findOne({
      where: { id },
      relations: {
        tema: true,
        usuario: true,
      },
    });
    if (!postagem)
      throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND);

    return postagem;
  }

  async findByTitulo(titulo: string): Promise<Postagem[]> {
    return this.postagemRepository.find({
      where: {
        titulo: ILike(`%${titulo}%`), // ILike - incensitivo(descarta acento e upper or low case)
      },
      relations: {
        tema: true,
        usuario: true,
      },
    });
  }

  async create(postagem: Postagem): Promise<Postagem> {
    // INSERT INTO tb_postagens (titulo, texto) VALUES (?, ?)

    await this.temaService.findById(postagem.tema.id);

    return await this.postagemRepository.save(postagem);
  }

  async update(postagem: Postagem): Promise<Postagem> {
    await this.findById(postagem.id);

    if (!postagem.id || postagem.id < 0 )
      throw new HttpException('Digite um ID', HttpStatus.BAD_REQUEST);

    await this.temaService.findById(postagem.tema.id);

    //UPDATE tb_postagens SET titulo = ?, texto = ? , WHERE id = ?
    return await this.postagemRepository.save(postagem);
  }

  async delete(id: number): Promise<DeleteResult> {
    // DeleteResult - serve para encerrar a promisse
    await this.findById(id);

    //Delete tb_postagem WHERE id = ?
    return await this.postagemRepository.delete(id);
  }
}
