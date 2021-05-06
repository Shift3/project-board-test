import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AgencyRepository, UserRepository, RoleRepository, User } from '@models';

import {
  UserChangePasswordDto,
  UserCreationDto,
  UserForgotPasswordDto,
  UserResetPasswordDto,
  UserSignupDto,
  UserUpdateDto,
  UserUpdateProfileDto
} from './dto';

import { JwtResponseDto } from '../auth/dto/jwt-response.dto';

describe('User Controller', () => {
  let controller: UserController;
  let userService: UserService;

  const mockAgencyRepository = () => ({}),
    mockRoleRepository = () => ({}),
    mockUserRepository = () => ({});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: AgencyRepository,
          useFactory: mockAgencyRepository
        },
        {
          provide: RoleRepository,
          useFactory: mockRoleRepository
        },
        {
          provide: UserRepository,
          useFactory: mockUserRepository
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //This pattern of spy/resolution is what they recommend for nest: https://docs.nestjs.com/fundamentals/testing#unit-testing 
  //Its argumentally not very useful other than testing the interactions between the service and the controller.
  //The e2e and service spec is more useful, but still want to provide test coverage in the recommended way. 
  describe('activateAccount', () => {
    it('should return a promised user', async () => {
      let result: Promise<User>;
      jest.spyOn(userService, 'activateUserAccount').mockImplementation(() => result);

      expect(await controller.activateAccount('totallyrealtoken', new UserResetPasswordDto)).toBe(result);
    });
  });

  describe('changeUserPassword', () => {
    it('should return a promised JwtResponseDto', async () => {
      let result: Promise<JwtResponseDto>;
      jest.spyOn(userService, 'changeUserPassword').mockImplementation(() => result);

      expect(await controller.changeUserPassword(new User, new UserChangePasswordDto, 1)).toBe(result);
    });
  });

  describe('createUser', () => {
    it('should return a promised User', async () => {
      let result: Promise<User>;
      jest.spyOn(userService, 'createUser').mockImplementation(() => result);

      expect(await controller.createUser(new User, new UserCreationDto)).toBe(result);
    });
  });

  describe('forgotPassword', () => {
    it('should return a promised message string', async () => {
      let result: Promise<{message: string}>;
      jest.spyOn(userService, 'sendResetPasswordEmail').mockImplementation(() => result);

      expect(await controller.forgotPassword(new UserForgotPasswordDto)).toBe(result);
    });
  });

  describe('getSingleUser', () => {
    it('should return a promised User', async () => {
      let result: Promise<User>;
      jest.spyOn(userService, 'findSingleUser').mockImplementation(() => result);

      expect(await controller.getSingleUser(new User, 1)).toBe(result);
    });
  });

  //TODO: Mock user roles and when user is not a super user vs when it is.
  describe.skip('getAllUsers', () => {});

  describe('getUserProfile', () => {
    it('should return a promised User', async () => {
      let result: Promise<User>;
      jest.spyOn(userService, 'findSingleUser').mockImplementation(() => result);

      expect(await controller.getUserProfile(new User, 1)).toBe(result);
    });
  });

  describe('resendActivationEmail', () => {
    it('should return a promised User', async () => {
      let result: Promise<User>;
      jest.spyOn(userService, 'resendActivationEmail').mockImplementation(() => result);

      expect(await controller.resendActivationEmail(1, new User)).toBe(result);
    });
  });

  describe('resetPassword', () => {
    it('should return a promised User', async () => {
      let result: Promise<User>;
      jest.spyOn(userService, 'resetUserPassword').mockImplementation(() => result);

      expect(await controller.resetPassword('totallyrealtoken', new UserResetPasswordDto)).toBe(result);
    });
  });

  describe('signup', () => {
    it('should return a promised User', async () => {
      let result: Promise<User>;
      jest.spyOn(userService, 'signUp').mockImplementation(() => result);

      expect(await controller.signup(new UserSignupDto)).toBe(result);
    });
  });

  //Should this return a user at all? 204 (no content)
  describe('softDeleteUser', () => {
    it('should return a promised User', async () => {
      let result: Promise<User>;
      jest.spyOn(userService, 'softDeleteUser').mockImplementation(() => result);

      expect(await controller.softDeleteUser(new User, 1)).toBe(result);
    });
  });

  describe('updateProfile', () => {
    it('should return a promised User', async () => {
      let result: Promise<User>;
      jest.spyOn(userService, 'updateUserProfile').mockImplementation(() => result);

      expect(await controller.updateProfile(new User, 1, new UserUpdateProfileDto)).toBe(result);
    });
  });

  describe('updateSingleUser', () => {
    it('should return a promised User', async () => {
      let result: Promise<User>;
      jest.spyOn(userService, 'updateSingleUser').mockImplementation(() => result);

      expect(await controller.updateSingleUser(new User, 1, new UserUpdateDto)).toBe(result);
    });
  });
});
