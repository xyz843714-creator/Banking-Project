import { Injectable } from "@nestjs/common";
const Twilio = require('twilio');

@Injectable()
export class SmsService {
  private client;

  constructor() {
    this.client = Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendSms(to: string, message: string) {
    try {
      const formattedNumber = to.startsWith('+') ? to : `+91${to}`;

      await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE, // moved to env
        to: formattedNumber,
      });

      console.log(`SMS sent to ${formattedNumber}`);

    } catch (err) {
      console.error('SMS Error:', err.message);
    }
  }
}
