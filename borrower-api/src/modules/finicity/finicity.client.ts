import {
  CACHE_MANAGER,
  HttpService,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CustomerEntity } from '../../entities/customer.entity';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import * as moment from 'moment';
import { Owner } from './finicity.service';

@Injectable()
export class FinicityClient {
  readonly ACCESS_TOKEN_LIFETIME = 7180;
  readonly FINICITY_DOMAIN = 'https://api.finicity.com';
  headers: {
    'Finicity-App-Token'?: string;
    'Finicity-App-Key': string;
    'Content-Type': string;
    Accept: string;
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(HttpService) private httpService: HttpService,
  ) {}

  setToken(token: string) {
    this.headers = {
      ...this.headers,
      'Finicity-App-Token': token,
    };
  }

  async loadToken() {
    const token = (await this.cacheManager.get(
      'finicityAccessToken',
    )) as string;

    if (!this.headers) {
      this.headers = {
        'Finicity-App-Key': process.env.FINICITY_APPKEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
    }

    if (token) {
      this.setToken(token);
    } else {
      await this.accessToken();
    }
  }

  async accessToken() {
    try {
      const body = {
        partnerId: process.env.FINICITY_PARTNERID,
        partnerSecret: process.env.FINICITY_SECRETKEY,
      };

      const axiosResponse = await this.httpService
        .post(
          `${this.FINICITY_DOMAIN}/aggregation/v2/partners/authentication`,
          body,
          { headers: this.headers },
        )
        .toPromise();

      if (axiosResponse?.data?.token) {
        this.setToken(axiosResponse.data.token);
        await this.cacheManager.set(
          'finicityAccessToken',
          axiosResponse.data.token,
          { ttl: this.ACCESS_TOKEN_LIFETIME },
        );
      }

      return axiosResponse?.data?.token;
    } catch (error) {
      throw new Error('Error on Finicity API authentication');
    }
  }

  async findFinicityCustomer(username: string) {
    await this.loadToken();
    let customer = null;

    try {
      const axiosResponse = await this.httpService
        .get(`${this.FINICITY_DOMAIN}/aggregation/v1/customers`, {
          headers: this.headers,
          params: {
            username,
          },
        })
        .toPromise();

      if (axiosResponse.data) {
        customer = axiosResponse.data.customers[0];
      }
      // tslint:disable-next-line:no-empty
    } catch (e) {}

    return customer;
  }

  async addFinicityCustomer(username: string) {
    await this.loadToken();

    try {
      const customer = await this.httpService
        .post(
          `${this.FINICITY_DOMAIN}/aggregation/v2/customers/active`,
          {
            username,
          },
          { headers: this.headers },
        )
        .toPromise();

      return customer.data;
    } catch (e) {
      throw new Error('Error during finicity customer crating process');
    }
  }

  async bankAccounts(customerId: string) {
    await this.loadToken();

    try {
      const axiosResponse = await this.httpService
        .post(
          `${this.FINICITY_DOMAIN}/aggregation/v1/customers/${customerId}/accounts`,
          null,
          {
            headers: this.headers,
          },
        )
        .toPromise();

      return axiosResponse.data;
    } catch (e) {
      throw new Error('Error receiving customer bank accounts data');
    }
  }

  async bankUrl(customerId: string, loanId: string): Promise<{ link: string }> {
    await this.loadToken();

    try {
      const body = {
        partnerId: process.env.FINICITY_PARTNERID,
        experience: 'b185ddcd-694a-4a88-a269-4420bcb8ec57', // todo move to env
        customerId,
        webhook: `${process.env.API_URL}/finicity/web-hook/${loanId}`,
      };
      const axiosResponse = await this.httpService
        .post(`${this.FINICITY_DOMAIN}/connect/v2/generate`, body, {
          headers: this.headers,
        })
        .toPromise();

      return axiosResponse.data;
    } catch (e) {
      throw new Error('Error during finicity link generation process');
    }
  }

  async getBankAccountDetails(customerId: string, accountId: string) {
    await this.loadToken();

    const axiosResponse = await this.httpService
      .get(
        `${this.FINICITY_DOMAIN}/aggregation/v1/customers/${customerId}/accounts/${accountId}/details`,
        {
          headers: this.headers,
        },
      )
      .toPromise();

    return axiosResponse.data;
  }

  async getAggregatedAttributes(customer: CustomerEntity, accounts) {
    await this.loadToken();

    try {
      await this.getConsumer(customer.finicity_id);
    } catch (errorGet) {
      await this.createConsumer(customer);
    }

    // todo refactor
    const res = await this.generateConsumerAttribute(
      customer.finicity_id,
      accounts,
    );
    let analyticId = res?.data?.analytic_id;

    if (!analyticId) {
      const analytics = await this.getAnalyticsIds(customer.finicity_id);
      analyticId = analytics?.data?.analytic_ids?.slice(-1)?.analytic_id;
    }

    return await this.getAttributesByAnalyticsId(
      customer.finicity_id,
      analyticId,
    );
  }

  async getConsumer(customerId: string): Promise<AxiosResponse<any>> {
    return await this.httpService
      .get(
        `${this.FINICITY_DOMAIN}/decisioning/v1/customers/${customerId}/consumer`,
        { headers: this.headers },
      )
      .toPromise();
  }

  async generateConsumerAttribute(
    customerId: string,
    accountsIds,
  ): Promise<AxiosResponse<{ analytic_id: string } | null>> {
    try {
      return await this.httpService
        .post(
          `${this.FINICITY_DOMAIN}/analytics/ca360/v1/customers/${customerId}/analytics`,
          { accountsIds },
          { headers: this.headers },
        )
        .toPromise();
    } catch (e) {
      return of(null).toPromise();
    }
  }

  async getAnalyticsIds(customerId: string): Promise<AxiosResponse<any>> {
    return await this.httpService
      .get(
        `${this.FINICITY_DOMAIN}/analytics/ca360/v1/customers/${customerId}/analytics`,
        { headers: this.headers },
      )
      .toPromise();
  }

  async getAttributesByAnalyticsId(
    customerId: string,
    analyticsId: string,
  ): Promise<any> {
    let res;
    try {
      res = await this.httpService
        .get(
          `${this.FINICITY_DOMAIN}/analytics/ca360/v1/customers/${customerId}/analytics/${analyticsId}`,
          { headers: this.headers },
        )
        .toPromise();
    } catch (e) {
      res = of({
        data: e,
        statusText: e.message,
      }).toPromise();
    }

    return res;
  }

  async createConsumer(customer: CustomerEntity): Promise<AxiosResponse<any>> {
    const birthday = moment(customer.birthday, 'YYYY-MMMM-DD');
    const data = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      address: customer.streetAddress,
      city: customer.city,
      state: customer.state,
      zip: customer.zipCode,
      phone: customer.phone,
      ssn: customer.socialSecurityNumber,
      email: customer.email,
      suffix: 'Esq',
      birthday: {
        dayOfMonth: birthday.format('DD'),
        year: birthday.format('YYYY'),
        month: birthday.format('MM'),
      },
    };

    return await this.httpService
      .post(
        `${this.FINICITY_DOMAIN}/decisioning/v1/customers/${customer.finicity_id}/consumer`,
        data,
        { headers: this.headers },
      )
      .toPromise();
  }

  async getOwner(customerId: string, accountId: string): Promise<Owner> {
    await this.loadToken();
    try {
      const axiosResponse = await this.httpService
        .get(
          `${this.FINICITY_DOMAIN}/aggregation/v1/customers/${customerId}/accounts/${accountId}/owner`,
          { headers: this.headers },
        )
        .toPromise();
      return axiosResponse.data;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
