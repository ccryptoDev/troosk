import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from 'src/repository/customer.repository';
import {
  UpdateUserCityDto,
  UpdateUserNameDto,
  UpdateUserStreetDto,
  UpdateUserZipCodeDto,
} from './dto/user-info.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async editUserName(id, updateUserNameDto: UpdateUserNameDto) {
    try {
      await this.customerRepository.update(
        { user_id: id },
        {
          firstName: updateUserNameDto.firstName,
          lastName: updateUserNameDto.lastName,
        },
      );
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async editUserStreetAddress(id, updateUserStreetDto: UpdateUserStreetDto) {
    try {
      await this.customerRepository.update(
        { user_id: id },
        {
          streetAddress: updateUserStreetDto.streetAddress,
        },
      );
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async editUserCity(id, updateUserCityDto: UpdateUserCityDto) {
    try {
      await this.customerRepository.update(
        { user_id: id },
        {
          city: updateUserCityDto.city,
        },
      );
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async editUserZipCode(id, updateUserZipCodeDto: UpdateUserZipCodeDto) {
    try {
      await this.customerRepository.update(
        { user_id: id },
        {
          zipCode: updateUserZipCodeDto.zipCode,
        },
      );
      return { statusCode: 200 };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
