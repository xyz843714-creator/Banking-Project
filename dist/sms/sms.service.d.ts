export declare class SmsService {
    private client;
    constructor();
    sendSms(to: string, message: string): Promise<void>;
}
