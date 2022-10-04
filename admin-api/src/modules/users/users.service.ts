import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SigninCreadentialsDto, VerifyOtpDto } from './dto/signin-user.dto';
import { ForgotPasswordDto } from './dto/forgotpassword-user.dto';
import { PasswordResetDto, CheckTokenDto } from './dto/passwordreset.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserRepository } from '../../repository/users.repository';
import { OTPRepository } from '../../repository/otp.repository';
import { TokenRepository } from '../../repository/token.repository';
import { OtpEntity } from '../../entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import IJwtPayload from '../../payloads/jwt-payload';
import { UserEntity, Flags } from '../../entities/users.entity';

import { getManager, In } from 'typeorm';
import { AddCreadentialsDto } from './dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../mail/mail.service';
import { config } from 'dotenv';
import { use } from 'passport';
import { RolesService } from '../roles/roles.service';
import * as crypto from 'crypto';
import { bcryptConfig } from 'src/configs/configs.constants';
import { TokenEntity } from '../../entities/token.entity';
import { LoanRepository } from '../../repository/loan.repository';
import { Responses } from '../../common/responses';

config();

export enum UsersRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  INSTALLER = 'installer',
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(OTPRepository)
    private readonly oTPRepository: OTPRepository,
    @InjectRepository(TokenRepository)
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly rolesService: RolesService,
  ) {}

  async signIn(signinCreadentialsDto: SigninCreadentialsDto) {
    const { email, password } = signinCreadentialsDto;
    try {
      const entityManager = getManager();
      const roles = await entityManager.query(
        `select distinct t2.role_id as role_id from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id where t."name" = 'admin' and t2.delete_flag = 'N'`,
      );
      if (roles.length > 0) {
        const r = [];
        for (let i = 0; i < roles.length; i++) {
          r.push(roles[i]['role_id']);
        }
        const user = await this.userRepository.findOne({
          select: [
            'id',
            'email',
            'firstName',
            'lastName',
            'role',
            'password',
            'twoFactorAuth',
          ],
          where: {
            delete_flag: 'N',
            active_flag: 'Y',
            email,
            role: In(r),
          },
        });
        if (user && (await user.validatePassword(password))) {
          const pages = await entityManager.query(
            `select distinct t.order_no ,t.id, t."name" as name from tblpages t join tblrolesmaster t2 on t2.pages_id = t.id where t2.role_id = ${user.role} and t2.delete_flag = 'N' order by t.order_no asc`,
          );
          if (pages.length > 0) {
            const tabs = {};
            for (let i = 0; i < pages.length; i++) {
              tabs[pages[i]['id']] = await entityManager.query(
                `select distinct t.order_no ,t.id, t."name" as name from tblpagetabs t join tblrolesmaster t2 on t2.pagetabs_id = t.id where t2.pages_id = ${pages[i]['id']} and t2.role_id = ${user.role} and t2.delete_flag = 'N' order by t.order_no asc `,
              );
            }
            const resuser = new UserEntity();
            resuser.id = user.id;
            resuser.email = user.email;
            resuser.firstName = user.firstName;
            resuser.lastName = user.lastName;
            resuser.role = user.role;
            resuser.twoFactorAuth = user.twoFactorAuth;
            // check 2-factor auth
            if (user.twoFactorAuth === 'N') {
              const payload: IJwtPayload = { email, role: UsersRole.ADMIN };
              const jwtAccessToken = await this.jwtService.signAsync(payload);
              return {
                statusCode: 200,
                jwtAccessToken,
                resuser,
                pages,
                tabs,
                loanId: null,
              };
            } else {
              // create otp
              let otp = '';
              const length = 6;
              const charset = '123456789';
              for (let i = 0, n = charset.length; i < length; ++i) {
                otp += charset.charAt(Math.floor(Math.random() * n));
              }

              // save otp
              const checkOtp = await this.oTPRepository.findOne({
                user_id: user.id,
              });

              // tslint:disable-next-line:no-shadowed-variable
              const entityManager = getManager();
              const current_timestamp = await entityManager.query(
                `select current_timestamp`,
              );

              if (checkOtp) {
                await this.oTPRepository.update(
                  { user_id: user.id },
                  {
                    otp: Number(otp),
                    checkTime: current_timestamp[0].current_timestamp,
                  },
                );
              } else {
                const newOtp = new OtpEntity();
                newOtp.user_id = user.id;
                newOtp.otp = Number(otp);
                newOtp.checkTime = current_timestamp[0].current_timestamp;

                await this.oTPRepository.save(newOtp);
              }

              // send mail
              this.mailService.sendOtp(email, otp, user.firstName, '');

              return { statusCode: 200, resuser, pages, tabs, loanId: null };
            }
          } else {
            return {
              statusCode: 400,
              message: ['No Page In This User'],
              error: 'Bad Request',
            };
          }
        } else {
          return {
            statusCode: 400,
            message: ['Invalid credentials.'],
            error: 'Bad Request',
          };
        }
      }
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async list() {
    const entityManager = getManager();

    try {
      const rawData = await entityManager.query(`select
        distinct u.ref_no, u.*, r.name as role_name
        from tbluser u
        left join tblroles r on u.role = r.id
        left join tblrolesmaster t on t.role_id = u.role
        left join tblportal t2 on t.portal_id = t2.id
        where u.delete_flag = 'N'
        and t.delete_flag = 'N'
        and t2."name" = 'admin'
        order by "createdAt" desc`);
      return { statusCode: 200, data: rawData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getdetails(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select id,ref_no, email, "firstName" as firstName, "lastName" as lastName, role, active_flag, "emailVerify" from tbluser where delete_flag = 'N' and id = '${id}'`,
      );
      return { statusCode: 200, data: rawData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async active(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `UPDATE tbluser SET active_flag='Y'::tbluser_active_flag_enum::tbluser_active_flag_enum WHERE id='${id}'`,
      );
      return { statusCode: 200, data: rawData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async deactive(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `UPDATE tbluser SET active_flag='N'::tbluser_active_flag_enum::tbluser_active_flag_enum WHERE id='${id}'`,
      );
      return { statusCode: 200, data: rawData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async delete(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `UPDATE tbluser SET delete_flag='Y'::tbluser_delete_flag_enum::tbluser_delete_flag_enum WHERE id='${id}'`,
      );
      return { statusCode: 200, data: rawData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async add(addCreadentialsDto: AddCreadentialsDto) {
    let url: any = process.env.InfinityEnergyUrl;
    const user = new UserEntity();
    if (
      addCreadentialsDto.email &&
      typeof addCreadentialsDto.email === 'string'
    ) {
      if (addCreadentialsDto.email.trim().length === 0) {
        return {
          statusCode: 400,
          message: ['Email should not be empty'],
          error: 'Bad Request',
        };
      } else {
        user.email = addCreadentialsDto.email;
      }
    } else {
      return {
        statusCode: 400,
        message: ['Email should not be empty'],
        error: 'Bad Request',
      };
    }

    if (
      addCreadentialsDto.role &&
      typeof addCreadentialsDto.role === 'number'
    ) {
      const adminRolesRes = await this.rolesService.getAdminPortalRoles();
      if (!adminRolesRes.data.find(o => o.id === addCreadentialsDto.role)) {
        return {
          statusCode: 400,
          message: ['Selected Role is not in admin portal'],
          error: 'Bad Request',
        };
      }
      user.role = addCreadentialsDto.role;
      url = url + 'admin/login';
    } else {
      return {
        statusCode: 400,
        message: ['Selected Role is not valid'],
        error: 'Bad Request',
      };
    }
    try {
      const users: any = await this.userRepository.find({
        select: ['email'],
        where: { delete_flag: 'N', email: user.email, role: user.role },
      });
      if (users.length > 0) {
        return {
          statusCode: 400,
          message: ['This Email Already Exists'],
          error: 'Bad Request',
        };
      }
      if (
        addCreadentialsDto.firstName &&
        typeof addCreadentialsDto.firstName === 'string'
      ) {
        if (addCreadentialsDto.firstName.trim().length === 0) {
          return {
            statusCode: 400,
            message: ['firstName should not be empty'],
            error: 'Bad Request',
          };
        } else {
          user.firstName = addCreadentialsDto.firstName;
        }
      } else {
        return {
          statusCode: 400,
          message: ['firstName should not be empty'],
          error: 'Bad Request',
        };
      }

      if (
        addCreadentialsDto.lastName &&
        typeof addCreadentialsDto.lastName === 'string'
      ) {
        if (addCreadentialsDto.lastName.trim().length === 0) {
          return {
            statusCode: 400,
            message: ['firstName should not be empty'],
            error: 'Bad Request',
          };
        } else {
          user.lastName = addCreadentialsDto.lastName;
        }
      } else {
        return {
          statusCode: 400,
          message: ['firstName should not be empty'],
          error: 'Bad Request',
        };
      }

      const length = 8;
      const charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }

      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, user.salt);
      user.active_flag = Flags.Y;
      await this.userRepository.save(user);
      this.mailService.add(user.email, password, url);
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async toggleTwoFactorAuth(userId, toggleValue) {
    try {
      await this.userRepository.update(
        { id: userId },
        { twoFactorAuth: toggleValue.value ? Flags.Y : Flags.N },
      );
      return {
        statusCode: 200,
        message: ['Changed Two factor Authentication Successfully!'],
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getTwoFactorAuth(userId) {
    try {
      const user = await this.userRepository.findOne({ id: userId });
      return { statusCode: 200, data: user };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const entityManager = getManager();

      const userAuthOtp = await entityManager.query(
        `select current_timestamp, * from tblotp where user_id='${verifyOtpDto.user_id}'`,
      );

      if (userAuthOtp) {
        // check otp expired or not(5 min)
        const d1 = new Date(userAuthOtp[0].current_timestamp);
        const d2 = new Date(userAuthOtp[0].checkTime);
        const timeDiffInSec = (d1.getTime() - d2.getTime()) / 1000;

        if (userAuthOtp[0].otp === verifyOtpDto.otp && timeDiffInSec <= 300) {
          const user = await this.userRepository.findOne({
            select: ['email'],
            where: { delete_flag: 'N', id: verifyOtpDto.user_id },
          });
          const payload: IJwtPayload = {
            email: user.email,
            role: UsersRole.ADMIN,
          };
          const jwtAccessToken = await this.jwtService.signAsync(payload);

          return { statusCode: 200, jwtAccessToken };
        } else {
          return {
            statusCode: 101,
            message: ['Invalid or expired OTP. Login again to get new OTP'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 100,
          message: ['Invalid or expired OTP. Login again to get new OTP'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async forgotPassword(forgotPassword) {
    try {
      const entityManager = getManager();
      const roles = await entityManager.query(
        `select distinct t2.role_id as role_id from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id where t."name" = 'admin' and t2.delete_flag = 'N'`,
      );
      if (roles.length > 0) {
        const r = [];
        for (let i = 0; i < roles.length; i++) {
          r.push(roles[i]['role_id']);
        }
        const user = await this.userRepository.findOne({
          where: {
            email: forgotPassword.email,
            role: In(r),
            delete_flag: 'N',
          },
        });
        if (user) {
          const token = await this.tokenRepository.findOne({ id: user.id });
          if (token) {
            await this.tokenRepository.delete({ id: user.id });
          }
          const resetToken = crypto.randomBytes(32).toString('hex');
          const hash = await bcrypt.hash(
            resetToken,
            Number(bcryptConfig.saltRound),
          );
          const tokenEntity = new TokenEntity();
          tokenEntity.id = user.id;
          tokenEntity.token = hash;

          await this.tokenRepository.save(tokenEntity);
          const link = `${process.env.InfinityEnergyUrl}admin/passwordReset?token=${resetToken}&id=${user.id}`;

          this.mailService.passwordResetMail(forgotPassword.email, link);
          return {
            statusCode: 200,
            message: ['Reset password link sent Successfully'],
          };
        } else {
          return {
            statusCode: 100,
            message: ['User does not exist'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 100,
          message: ['User does not exist'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
  async passwordReset(passwordResetDto: PasswordResetDto) {
    try {
      const entityManager = getManager();
      const roles = await entityManager.query(
        `select distinct t2.role_id as role_id from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id where t."name" = 'admin' and t2.delete_flag = 'N'`,
      );
      if (roles.length > 0) {
        const r = [];
        for (let i = 0; i < roles.length; i++) {
          r.push(roles[i]['role_id']);
        }
        const checkUser = await this.userRepository.findOne({
          where: { id: passwordResetDto.id, role: In(r), delete_flag: 'N' },
        });
        if (checkUser) {
          const salt = await bcrypt.genSalt();
          const hashPassword = await bcrypt.hash(passwordResetDto.newpw, salt);

          await this.userRepository.update(
            { id: passwordResetDto.id },
            { password: hashPassword, salt },
          );
          return {
            statusCode: 200,
            message: ['Password Changed Successfully'],
          };
        } else {
          return {
            statusCode: 100,
            message: ['Invalid user'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 100,
          message: ['Invalid user'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async changePassword(id, changePasswordDto: ChangePasswordDto) {
    const { currentpw, newpw } = changePasswordDto;
    try {
      const entityManager = getManager();
      const roles = await entityManager.query(
        `select distinct t2.role_id as role_id from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id where t."name" = 'admin' and t2.delete_flag = 'N'`,
      );
      if (roles.length > 0) {
        const r = [];
        for (let i = 0; i < roles.length; i++) {
          r.push(roles[i]['role_id']);
        }

        const user = await this.userRepository.findOne({
          select: ['id', 'email', 'firstName', 'lastName', 'role', 'password'],
          where: { delete_flag: 'N', active_flag: 'Y', id, role: In(r) },
        });
        if (user && (await user.validatePassword(currentpw))) {
          const salt = await bcrypt.genSalt();
          const hashPassword = await bcrypt.hash(newpw, salt);

          await this.userRepository.update(
            { id },
            { password: hashPassword, salt },
          );
          return {
            statusCode: 200,
            message: ['Password Changed Successfully'],
          };
        } else {
          return { statusCode: 100, message: ['Current Password Is Wrong'] };
        }
      } else {
        return { statusCode: 200, message: ['Password Changed Successfully'] };
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async checkToken(checkTokenDto: CheckTokenDto) {
    try {
      const passwordResetToken = await this.tokenRepository.findOne({
        where: { id: checkTokenDto.id },
      });
      if (passwordResetToken) {
        const isValid = await bcrypt.compare(
          checkTokenDto.token,
          passwordResetToken.token,
        );

        if (isValid) {
          return { statusCode: 200, message: ['Token is valid'] };
        } else {
          return {
            statusCode: 101,
            message: ['Invalid or expired password reset token'],
            error: 'Bad Request',
          };
        }
      } else {
        return {
          statusCode: 100,
          message: ['Invalid or expired password reset token'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
