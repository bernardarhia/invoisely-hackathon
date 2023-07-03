export interface BasePaystackResponse {
  status: boolean;
  message: string;
}
export interface IPayStack {}
export interface PayStackQueryOptions {
  hostname: string;
  port?: 443 | number;
  path: string;
  method: HTTP_METHODS;
  headers: {
    Authorization: string;
  };
  body?: Record<string, string | number>;
}
type BankType = "nuban";
type PayStackCurrency = "NGN" | "GHS" | "ZAR" | "USD";
type HTTP_METHODS = "GET" | "HEAD" | "POST" | "PUT" | "PATH" | "DELETE";
interface BaseGetBankResponse {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: null | string;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: PayStackCurrency;
  type: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetBanksQueryParams {
  /**
   * The country from which to obtain the list of supported banks. e.g country=ghana or country=nigeria:
   *
   * **Note**: Make sure country name is in lowercase
   */
  country?: string;
  /**
   * Flag to enable cursor pagination on the endpoint
   */
  use_cursor?: boolean;
  /**
   *The number of objects to return per page. Defaults to 50, and limited to 100 records per page.
   */
  perPage?: number;
  /**
   * A flag to filter for banks a customer can pay directly from
   */
  pay_with_bank?: boolean;
  /**
   * A flag to filter for available banks a customer can make a transfer to complete a payment
   */
  pay_with_bank_transfer?: boolean;
  /**
   *A cursor that indicates your place in the list. It can be used to fetch the next page of the list
   */
  next?: string;
  /**
   *A cursor that indicates your place in the list. It should be used to fetch the previous page of the list after an intial next request
   */
  previous?: string;
  /**
   * The gateway type of the bank. It can be one of these: [emandate, digitalbankmandate]
   *
   */
  gateway?: string;
  /**
   * Type of financial channel. For Ghanaian channels, please use either mobile_money for mobile money channels OR ghipps for bank channels
   */
  type?: string;
  /**
   * Any of NGN, USD, GHS or ZAR
   */
  currency?: PayStackCurrency;
}
export interface GetBanksResponse extends BasePaystackResponse {
  data: BaseGetBankResponse[];
}
export interface GetCountriesResponse extends BasePaystackResponse {
  id: number;
  active_for_dashboard_onboarding: boolean;
  name: string;
  iso_code: string;
  default_currency_code: PayStackCurrency;
  integration_defaults: any;
  calling_code: string;
  pilot_mode: boolean;
  relationships: {
    currency: {
      type: string;
      data: PayStackCurrency[];
      supported_currencies: {
        NGN: {
          bank: {
            bank_type: BankType;
            branch_code: boolean;
            account_name: boolean;
            account_verification_required: boolean;
            account_number_label: string;
            account_number_pattern: {
              exact_match: boolean;
              pattern: string;
            };
            documents: any[];
            show_account_number_tooltip: boolean;
          };
        };
        USD: {
          bank: {
            bank_type: BankType;
            required_fields: string[];
            branch_code: boolean;
            account_name: boolean;
            account_verification_required: true;
            account_number_label: string;
            account_number_pattern: {
              exact_match: boolean;
              pattern: string;
            };
            documents: any[];
            notices: string[];
          };
        };
      };
    };
    integration_feature: {
      type: string;
      data: any[];
    };
    integration_type: {
      type: string;
      data: string[];
    };
    payment_method: {
      type: string;
      data: string[];
    };
  };
}

export interface VerifyNumberQueryParams {
  /**
   * Account number
   */
  account_number: string;
  /**
   * Bank code - you can use the **getBanks** method to retrieve a list of banks
   */
  bank_code: string;
}

export interface VerifyNumberResponse extends BasePaystackResponse {
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

export interface CardBINResponse extends BasePaystackResponse {
  data: {
    bin: string;
    brand: "American Express" | "Discover" | " Mastercard" | "Visa";
    sub_brand: string;
    country_code: string;
    country_name: string;
    card_type: string;
    bank: string;
    linked_bank_id: number;
  };
}

export interface BasePaymentPayload {
  /**
   * Customer's email address
   *
   */
  email: string;
  /**
   * The transaction currency (NGN, GHS, ZAR or USD). Defaults to your integration currency.
   *
   */
  currency?: PayStackCurrency;
  /**
   * Amount you're requesting from the client and it should be in kobo if currency is NGN, pesewas, if currency is GHS, and cents, if currency is ZAR
   *
   */
  amount: number;
  /**
   *Unique transaction reference. Only -, ., = and alphanumeric characters allowed.
   *
   */
  reference?: string | any;
  /**
   * Fully qualified url, e.g. https://example.com/ . Use this to override the callback url provided on the dashboard for this transaction
   *
   */
  metadata?: {
    cart_id: number;
    custom_fields: {
      display_name: string;
      variable_name: string;
      value: number | string;
    }[];
  };
  /**
   * An array of payment channels to control what channels you want
   * to make available to the user to make a payment with.
   * Available channels include: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer", "eft"]
   *
   */
  channels?:
    | "card"
    | "bank"
    | "ussd"
    | "qr"
    | "mobile_money"
    | "bank_transfer"
    | "eft"[];
  /**
   * The code for the subaccount that owns the payment. e.g. ACCT_8f4s1eq7ml6rlzj
   *
   */
  subaccount?: string;
  /**
   *An amount used to override the split
    configuration for a single split payment. 
    If set, the amount specified goes to the main 
   account regardless of the split configuration.
   */
  transaction_charge?: number;
  /**
   * Who bears Paystack charges? account or subaccount (defaults to account).
   *
   */
  bearer?: string;
}

export interface InitializePaymentPayload extends BasePaymentPayload {
  callback_url?: string;
  /**
   * If transaction is to create a subscription to a predefined plan, provide plan code here. This would invalidate the value provided in amount
   *
   */
  plan?: string;
  /**
   * Number of times to charge customer during subscription to plan
   *
   */
  invoice_limit?: number;
  /**
   * The split code of the transaction split. e.g. SPL_98WF13Eb3w
   *
   */
  split_code?: string;
}

export interface InitializePaymentResponse extends BasePaystackResponse {
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface BaseTransactionResponse {
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: null;
    gateway_response: string;
    paid_at: Date;
    created_at: Date;
    channel: string;
    currency: PayStackCurrency;
    ip_address: string;
    metadata: string;
    log: {
      start_time: number;
      time_spent: number;
      attempts: number;
      errors: number;
      success: boolean;
      mobile: boolean;
      input: any[];
      history: {
        type: string;
        message: string;
        time: number;
      }[];
    };
    fees: number;
    fees_split: null | number;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: null | string;
    };
    customer: {
      id: number;
      first_name: null | string;
      last_name: null | string;
      email: string;
      customer_code: string;
      phone: null | string;
      metadata: null | Record<string, string | number>;
      risk_action: string;
      international_format_phone: null | string;
    };
    plan: null | string;
    split: any;
    order_id: null | number;
    paidAt: Date;
    createdAt: Date;
    requested_amount: number;
    pos_transaction_data: null | Record<string, string | number>;
    source: null | string;
    fees_breakdown: null | any;
    transaction_date: Date;
    plan_object: any;
    subaccount: any;
  };
}
export interface TransactionResponse
  extends BasePaystackResponse,
    BaseTransactionResponse {}

export interface ListTransactionsQueryParams {
  /**
   * Specify how many records you want to retrieve per page. If not specify we use a default value of 50.
   */
  perPage?: number;
  /**
   * Specify exactly what page you want to retrieve. If not specify we use a default value of 1.
   */

  page?: number;
  /**
   * Specify an ID for the customer whose transactions you want to retrieve
   */

  customer?: number;
  /**
   *
   * The Terminal ID for the transactions you want to retrieve
   */

  terminalId?: string;
  /**
   * Filter transactions by status ('failed', 'success', 'abandoned')
   */

  status?: "failed" | "success" | "abandoned";
  /**
   * A timestamp from which to start listing transaction e.g. 2016-09-24T00:00:05.000Z, 2016-09-21
   */
  from?: Date;
  /**
   * Filter transactions by amount. Specify the amount (in kobo if currency is NGN, pesewas, if currency is GHS, and cents, if currency is ZAR)
   */

  to?: Date;
  /**
   * Filter transactions by amount. Specify the amount (in kobo if currency is NGN, pesewas, if currency is GHS, and cents, if currency is ZAR)
   */

  amount?: number;
}
export interface ListTransactionsResponse extends BasePaystackResponse {
  data: BaseTransactionResponse[];
}
export interface ChargeAuthorizationPayload extends BasePaymentPayload {
  /**
   * Valid authorization code to charge
   */
  authorization_code: string;

  /**
   * If you are making a scheduled charge call,
   * it is a good idea to queue them so the processing system does
   * not get overloaded causing transaction processing errors.
   *  Send queue:true to take advantage of our queued charging.
   */
  queue?: boolean;
}

export interface TransactionTimelineResponse extends BasePaystackResponse {
  data: {
    time_spent: number;
    attempts: number;
    authentication: null | any;
    errors: number;
    success: boolean;
    mobile: boolean;
    input: any[];
    channel: string;
    history: {
      type: string;
      message: string;
      time: number;
    }[];
  };
}

export interface TransactionTotalQueryParams {
  /**
   * Specify how many records you want to retrieve per page. If not specify we use a default value of 50.
   */
  perPage: number;
  /**
   * Specify exactly what page you want to retrieve. If not specify we use a default value of 1.
   */

  page: number;
  /**
   * A timestamp from which to start listing transaction e.g. 2016-09-24T00:00:05.000Z, 2016-09-21
   */

  from?: Date;
  /**
   * A timestamp at which to stop listing transaction e.g. 2016-09-24T00:00:05.000Z, 2016-09-21
   */

  to?: Date;
}
export interface TransactionTotalResponse extends BasePaystackResponse {
  data: {
    total_transactions: number;
    unique_customers: number;
    total_volume: number;
    total_volume_by_currency: {
      currency: PayStackCurrency;
      amount: number;
    }[];
    pending_transfers: number;
    pending_transfers_by_currency: {
      currency: PayStackCurrency;
      amount: number;
    }[];
  };
}
export interface ExportTransactionQueryParams {
  /**
   * Specify how many records you want to retrieve per page. If not specify we use a default value of 50.
   */
  perPage: number;
  /**
   * Specify exactly what page you want to retrieve. If not specify we use a default value of 1.
   */

  page: number;
  /**
   * A timestamp from which to start listing transaction e.g. 2016-09-24T00:00:05.000Z, 2016-09-21
   */

  from?: Date;
  /**
   * A timestamp at which to stop listing transaction e.g. 2016-09-24T00:00:05.000Z, 2016-09-21
   */
  to?: Date;
  /**
   *Specify an ID for the customer whose transactions you want to retrieve
   */
  customer?: number;
  /**
   *Filter transactions by status ('failed', 'success', 'abandoned')
   */
  status?: "success" | "failed" | "abandoned";
  /**
   *Specify the transaction currency to export. Allowed values are: in kobo if currency is NGN, pesewas, if currency is GHS, and cents, if currency is ZAR
   */
  currency?: PayStackCurrency;
  /**
   *Filter transactions by amount. Specify the amount, in kobo if currency is NGN, pesewas, if currency is GHS, and cents, if currency is ZAR
   */
  amount?: number;
  /**
   *Set to true to export only settled transactions. false for pending transactions. Leave undefined to export all transactions
   */
  settled?: boolean;
  /**
   * An ID for the settlement whose transactions we should export
   */
  settlement?: number;
  /**
   * Specify a payment page's id to export only transactions conducted on said page
   */
  payment_page?: number;
}

export interface ExportTransactionResponse extends BasePaystackResponse {
  data: {
    path: string;
  };
  expireAt: Date;
}
