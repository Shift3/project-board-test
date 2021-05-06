import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role, RoleRepository, User, UserRoles } from '@models';

const testUserPasswordHash: string = '%48ZrB7@yfXgIy';

const superAdminTestUser = {
  id: 1,
  email: 'test+super@test-user.com',
  password: testUserPasswordHash,
  getFullName: () => 'Test User',
  sessionSalt: testUserPasswordHash,
  temporaryTokenHash: testUserPasswordHash,
  role: Object.assign(new Role, { roleName: UserRoles.SUPER_ADMIN }),
  agency: {
    agencyName: 'Test Agency 1'
  }
} as User;

describe('Role Controller', () => {
  let controller: RoleController;
  let roleService: RoleService;

  const mockRoleRespository = () => ({});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useFactory: mockRoleRespository
        }
      ]
    }).compile();

    controller = module.get<RoleController>(RoleController);
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserRoles', () => {
    it('should return an empty array of roles', async () => {
      let result: Promise<Role[]>;
      jest.spyOn(roleService, 'getUserRoles').mockImplementation(() => result);

      expect(await controller.getUserRoles(superAdminTestUser)).toBe(result);
    });
  });
});
