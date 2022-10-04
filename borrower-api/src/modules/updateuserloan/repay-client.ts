import { HttpService } from '@nestjs/common';
import { RetrievePaytoken, SavePayment, Source } from './dto/retrieve.paytoken';
import {
  ACHDetailsDto,
  PaymentMethod,
  TransactionType,
} from './dto/a-c-h-details.dto';

export class RepayClient {
  private readonly SUCCESS = 'ACCEPTED';
  private appToken: string;
  private appDomain: string;
  private appUrl: string;
  private requestConfig: {
    headers: {
      'Content-Type': string;
      Authorization: string;
    };
  };
  private convenienceAmount: string;
  private gatewayEndpoint: string;
  private gatewayConfig: {
    headers: {
      'Content-Type': string;
      'rg-api-user': string;
      'rg-api-secure-token': string;
      'rg-merchant-id': string;
    };
  };
  constructor(private http: HttpService) {
    this.appToken = process.env.REPAY_APP_TOKEN;
    this.appDomain = process.env.REPAY_API_DOMAIN;
    this.gatewayEndpoint = process.env.REPAY_ENDPOINT;
    this.convenienceAmount = process.env.REPAY_CONVENIENCE_AMOUNT;
    this.appUrl = `${this.appDomain}/checkout/merchant/api/v1`;

    this.requestConfig = {
      headers: {
        Authorization: `apptoken ${this.appToken}`,
        'Content-Type': 'application/json',
      },
    };
    this.gatewayConfig = {
      headers: {
        'Content-Type': 'application/json',
        'rg-api-user': process.env.REPAY_USERNAME,
        'rg-api-secure-token': process.env.REPAY_SECURE_TOKEN,
        'rg-merchant-id': process.env.REPAY_MERCHANT_ID,
      },
    };
  }

  async checkoutFormId(params): Promise<any> {
    return this.http
      .post(`${this.appUrl}/checkout`, params, this.requestConfig)
      .toPromise();
  }

  async ACHAuth(): Promise<any> {
    return await this.checkoutFormId({
      payment_method: PaymentMethod.ach,
      transaction_type: TransactionType.auth,
      Source: Source.auth,
    });
  }

  async checkoutPayment(isACH: boolean): Promise<any> {
    return await this.checkoutFormId({
      payment_method: isACH ? PaymentMethod.achToken : PaymentMethod.cardToken,
      Source: Source.api,
    });
  }

  async retrievePaytoken(formId: string, body: RetrievePaytoken): Promise<any> {
    return this.http
      .post(
        `${this.appUrl}/checkout-forms/${formId}/paytoken`,
        body,
        this.requestConfig,
      )
      .toPromise();
  }

  async tokenPayment(formId: string, body: RetrievePaytoken): Promise<any> {
    return this.http
      .post(
        `${this.appUrl}/checkout-forms/${formId}/token-payment`,
        body,
        this.requestConfig,
      )
      .toPromise();
  }

  async paymentMethods(customerId: string): Promise<any> {
    return this.http
      .get(
        `${this.appUrl}/customers/${customerId}/vault-tokens`,
        this.requestConfig,
      )
      .toPromise();
  }

  async tokenizeAndPlay(data, tokenBody): Promise<any> {
    const tokenResponse = await this.retrievePaytoken(
      data.checkout_form_id,
      tokenBody,
    );

    tokenBody.paytoken = tokenResponse.data.paytoken;

    return await this.tokenPayment(data.checkout_form_id, tokenBody);
  }

  async addACHAccount(ACHDetails: ACHDetailsDto): Promise<any> {
    const tokenBody = {
      ...ACHDetails,
      Source: Source.auth,
      amount: '0.00',
      save_payment_method: SavePayment.true,
      transaction_type: TransactionType.auth,
    } as RetrievePaytoken;

    const { data } = await this.ACHAuth();

    return await this.tokenizeAndPlay(data, tokenBody);
  }

  async ACHInstantDisbursement(data): Promise<any> {
    return this.http
      .post(
        `${this.gatewayEndpoint}/transactions/ach/credit`,
        data,
        this.gatewayConfig,
      )
      .toPromise();
  }

  isSuccess(response) {
    return response.data.result_text === this.SUCCESS;
  }
}
