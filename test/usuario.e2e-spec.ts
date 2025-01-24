import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Modulos Usuario e Auth', () => {
  let token: any;
  let usuarioId: any;
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
  });
  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve cadastrar um usuario', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar') //mandar a requisição com end point - definir caminho relativo
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(201);

    usuarioId = resposta.body.id;
  });

  it('02- Nao deve cadastar usuario duplicado', async () => {
    return await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(400);
  });

  it('03 - Deve autentificar o usuario(login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      })
      .expect(200);

    token = resposta.body.token;
  });

  it('04- Deve listar todos os usuarios', async () => {
    return await request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`)
      .expect(200);
  });

 it('04- Deve listar usuarios by ID', async () => {
   return await request(app.getHttpServer())
     .get(`/usuarios/${usuarioId}`)
     .set('Authorization', `${token}`)
     .expect(200);
 });


  it('04- Deve atualizar o usuario', async () => {
    return await request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Root atualizado',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: 'fotobonita.jpeg',
      })
      .expect(200)
      .then(resposta => {
        expect('Root atualizado').toEqual(resposta.body.nome)
      })
  });
});
