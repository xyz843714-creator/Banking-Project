import { Injectable } from "@nestjs/common";
const Twilio = require('twilio');

@Injectable()
export class SmsService {
  private client;

  constructor() {
this.client = Twilio(
      'dummy_sid_placeholder',
      'dummy_token_placeholder',
    );
  }

  // SMS sending
  async sendSms(to: string, message: string) {
    try {
      const formattedNumber = to.startsWith('+') ? to : `+91${to}`;

      await this.client.messages.create({
        body: message,
        from: '+17126257571', // ← Twilio number with +1
        to: formattedNumber,  // ← +91XXXXXXXXXX
      });

      console.log(`SMS sent to ${formattedNumber}`);

    } catch(err) {
      console.error('SMS Error:', err.message);
    }
  }
}

