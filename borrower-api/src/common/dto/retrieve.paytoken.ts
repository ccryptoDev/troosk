import {
  AccountType,
  ACHDetailsDto,
  TransactionType,
} from './a-c-h-details.dto';

export enum SavePayment {
  true = 'true',
  false = 'false',
}

export enum Source {
  api = 'Troosk API',
  hpp = 'Troosk HPP',
  auth = 'Troosk Auth',
}

export enum SecCode {
  customer = 'WEB',
  agent = 'TEL',
}

export enum ScheduleFrequency {
  once = 'Once',
  daily = 'Daily',
  weekly = 'Weekly',
  monthly = 'Monthly',
}

// structure which required by repay for /paytoken and /token-payment requests
// todo - make a separate structures for each type of payments (ach, card etc)
export interface RetrievePaytoken {
  amount: string;
  customer_id: string;
  Source: Source;
  transaction_type: TransactionType;
  ChannelUser?: string;

  // ach required
  name_on_check?: string;
  sec_code?: SecCode;
  ach_account_number?: string;
  ach_routing_number?: string;
  ach_account_type?: AccountType;
  email?: string;

  // auth required
  save_payment_method?: SavePayment;

  // /token-payment required
  paytoken?: string;

  // schedule ach required
  schedule_frequency?: ScheduleFrequency;
  schedule_interval?: string;
  schedule_starts?: string;
  schedule_ends?: string;
  schedule_max_runs?: string;

  // card required
  cardholder_name?: string;
  card_number?: string;
  card_cvc?: string;
  card_expiration?: string;
}
