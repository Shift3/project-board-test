import { Test } from '@nestjs/testing';
import { Role, User, UserRoles } from '@models';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { EndToEndTestingTypeOrmConfig } from '@database/e2e-testing.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { RoleModule } from '@modules/role/role.module';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';

const testUserPasswordHash: string = '%48ZrB7@yfXgIy';

describe('Role Controller', () => {
  let app: INestApplication;
  const testUser = {
    id: 1,
    email: 'test@test-user.com',
    password: '12345',
    firstName: 'Test',
    lastName: 'Last',
    sessionSalt: testUserPasswordHash,
    temporaryTokenHash: testUserPasswordHash,
    agency: {
      id: 1,
      agencyName: 'Main'
    },
    activatedAt: new Date()
   } as User;

  let toBeSavedUser = Object.assign(new User, testUser);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
          AuthModule,
          RoleModule,
          UserModule,
          TypeOrmModule.forRoot(EndToEndTestingTypeOrmConfig),
        ],

      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await setupTestData();
  });

  it(`/GET roles when user is unauthorized`, () => {
    return request(app.getHttpServer())
      .get('/roles')
      .expect(401);
  });


  it(`/GET roles when user is authorized and has an admin role`, async () => {
    let jwtToken = '';
    const adminRole: Role = await getConnection().manager.findOne(Role, { roleName: UserRoles.ADMIN });
    toBeSavedUser.role = Object.assign(new Role, adminRole);
    await toBeSavedUser.hashPassword('12345');

    const savedUser = await getConnection().manager.save(toBeSavedUser);

    //Login and get jwt
    //Example: https://gist.github.com/mjclemente/e13995c29376f0924eb2eacf98eaa5a6
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({email: savedUser.email, password: '12345'})
      .expect(200)
      .then(response => {
        jwtToken = response.body.jwtToken;
    })


    return request(app.getHttpServer())
      .get('/roles')
      .set('Authorization', `bearer ${jwtToken}`)
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect(
        [
          { id: 1, deletedAt: null, roleName: 'Admin' },
          { id: 2, deletedAt: null, roleName: 'Editor' }
        ]
      );
  });

  it(`/GET roles when user is authorized and has an editor role`, async () => {
    let jwtToken = '';
    const editorRole: Role = await getConnection().manager.findOne(Role, { roleName: UserRoles.EDITOR });
    toBeSavedUser.role = Object.assign(new Role, editorRole);
    await toBeSavedUser.hashPassword('12345');

    const savedUser = await getConnection().manager.save(toBeSavedUser);

    //Login and get jwt
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({email: savedUser.email, password: '12345'})
      .expect(200)
      .then(response => {
        jwtToken = response.body.jwtToken;
    })


    return request(app.getHttpServer())
      .get('/roles')
      .set('Authorization', `bearer ${jwtToken}`)
      .set('Content-Type', 'application/json')
      .expect(403);
  });

  afterAll(async () => {
    await clearTestData();

    await getConnection().close();
    app.close();
  });
});

const clearTestData = async () => {
  await getConnection().manager.delete(User, { firstName: 'Test' });
};

const setupTestData = async () => {
  const adminRole: Role = await getConnection().manager.findOne(Role, { roleName: UserRoles.ADMIN });

  if (!adminRole) {
    await getConnection().manager.save(Role, { roleName: UserRoles.ADMIN });
  }

  const editorRole: Role = await getConnection().manager.findOne(Role, { roleName: UserRoles.EDITOR });

  if (!editorRole) {
    await getConnection().manager.save(Role, { roleName: UserRoles.EDITOR });
  }
};
