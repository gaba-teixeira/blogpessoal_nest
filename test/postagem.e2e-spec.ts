// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from '../src/app.module';
// import { TypeOrmModule } from '@nestjs/typeorm';


// describe('Testes do Modulo Postagem (e2e)   ', () => {
//   let postagemId: any;

//   let app: INestApplication;


//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [
//         TypeOrmModule.forRoot({
//           type: 'sqlite',
//           database: ':memory:',
//           entities: [__dirname + './../src/**/entities/*.entity.ts'],
//           synchronize: true,
//           dropSchema: true,
//         }),

//         AppModule,
//       ],
//     }).compile();

//     app = moduleFixture.createNestApplication();

//     app.useGlobalPipes(new ValidationPipe());

//     await app.init();
//   });
//   afterAll(async () => {
//     await app.close();
//   });

// it('01 - Deve cadastrar uma postagem', async () => {
//   // Criar tema
//   const respostaTema = await request(app.getHttpServer())
//     .post('/temas')
//     .send({ descricao: 'Tema 01' })
//     .expect(201);

//   const testeTema = respostaTema.body;

//   // Criar usuario
//   const respostaUsuario = await request(app.getHttpServer())
//     .post('/usuarios/cadastrar')
//     .send({
//       nome: 'Root',
//       usuario: 'root@root.com',
//       senha: 'rootroot',
//       foto: '-',
//     })
//     .expect(201);

//   const testeUsuario = respostaUsuario.body;

//   // Criar postagem
//   const respostaPostagem = await request(app.getHttpServer())
//     .post('/postagens')
//     .send({
//       titulo: 'Postagem 01',
//       texto: 'Texto 01',
//       temaId: testeTema.id,
//       usuarioId: testeUsuario.id,
//     })
//     .expect(201);

//   postagemId = respostaPostagem.body.id;
// });

// });
