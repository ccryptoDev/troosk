import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

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

      // tslint:disable-next-line:no-shadowed-variable
      const response = await this.httpService
        .post(
          `${this.FINICITY_DOMAIN}/aggregation/v2/partners/authentication`,
          body,
          { headers: this.headers },
        )
        .toPromise();

      if (response?.data?.token) {
        this.setToken(response.data.token);
        await this.cacheManager.set(
          'finicityAccessToken',
          response.data.token,
          { ttl: this.ACCESS_TOKEN_LIFETIME },
        );
      }

      return response?.data?.token;
    } catch (error) {
      throw new Error('Error on Finicity API authentication');
    }
  }

  async findFinicityCustomer(username: string) {
    await this.loadToken();
    const customer = null;

    try {
      // tslint:disable-next-line:no-shadowed-variable
      const response = await this.httpService
        .get(`${this.FINICITY_DOMAIN}/aggregation/v2/customers`, {
          headers: this.headers,
          params: {
            username,
          },
        })
        .toPromise();

      // tslint:disable-next-line:no-empty
      if (response.data) {
      }
      // tslint:disable-next-line:no-empty
    } catch (e) {}

    return customer;
  }

  async addFinicityCustomer(username: string) {
    await this.loadToken();

    try {
      // tslint:disable-next-line:no-shadowed-variable
      const response = await this.httpService
        .post(
          `${this.FINICITY_DOMAIN}/aggregation/v2/customers/testing`,
          {
            username,
          },
          { headers: this.headers },
        )
        .toPromise();

      return response.data;
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

  async bankUrl(customerId: string): Promise<{ link: string }> {
    await this.loadToken();

    try {
      const body = {
        partnerId: process.env.FINICITY_PARTNERID,
        customerId,
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

    try {
      const axiosResponse = await this.httpService
        .get(
          `${this.FINICITY_DOMAIN}/aggregation/v1/customers/${customerId}/accounts/${accountId}/details`,
          {
            headers: this.headers,
          },
        )
        .toPromise();

      return axiosResponse.data;
    } catch (e) {
      throw new Error(e);
    }
  }
}
