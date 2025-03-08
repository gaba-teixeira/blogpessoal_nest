import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../src/usuario/entities/usuario.entity';

describe('Testes do Modulo Postagem (e2e)   ', () => {
  const postagem = {
    titulo: 'Postagem 01',
    texto: 'Texto da postagem 01',
    tema: {
      id: 1,
    },
    usuario: {
      id: 1,
    },
  };
  let token: any;
  let postagemId: any;
  let titulo: string = 'Postagem Atualizada';
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + './../src/**/entities/*.entity.ts'],
          synchronize: true,
          dropSchema: true,
        }),

        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    // Cria o usuário
    await request(app.getHttpServer()).post('/usuarios/cadastrar').send({
      nome: 'Root',
      usuario: 'root@root.com',
      senha: 'rootroot',
      foto: 'https://i.imgur.com/Tk9f10K.png',
      dataNascimento: '2000-01-01',
    });

    // Autentica o usuário e gera o token
    const response = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      });

    token = response.body.token;

    // Criar Tema
    await request(app.getHttpServer())
      .post('/temas')
      .set('Authorization', `${token}`)
      .send({
        tipo: 'Tema 01',
      });
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve Cadastrar Postagem', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/postagens')
      .set('Authorization', `${token}`)
      .send(postagem);
    expect(201);

    postagemId = resposta.body.id;
  });

  it('02- Deve Atualizar a Postagem', async () => {
    return request(app.getHttpServer())
      .put('/postagens')
      .set('Authorization', `${token}`)
      .send({
        id: postagemId,
        titulo: 'Postagem Atualizada',
        texto: 'Texto 01',
        tema: {
          id: 1,
        },
        usuario: {
            id: 1,
        }
      })
      .expect(200)
      .then((resposta) => {
        expect('Postagem Atualizada').toEqual(resposta.body.titulo);
      });
  });

  it('02 - Deve Listar todos as postagens', async () => {
    return request(app.getHttpServer())
      .get('/postagens')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('03 - Deve Listar uma postagem pelo ID', async () => {
    return request(app.getHttpServer())
      .get(`/postagens/${postagemId}`)
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it('04 - Deve Listar todos os postagens pelo nome', async () => {
    return request(app.getHttpServer())
      .get(`/postagens/titulo/${titulo}`)
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it('06 - Deve Deletar uma Postagem', async () => {
    return request(app.getHttpServer())
      .delete(`/postagens/${postagemId}`)
      .set('Authorization', `${token}`)
      .expect(204);
  });
});
