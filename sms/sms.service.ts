import { Injectable } from "@nestjs/common";
const Twilio = require('twilio');

@Injectable()
export class SmsService {
  private client;

  constructor() {
    this.client = Twilio(
      'AC0892f0ffc7bf0cb7e4a335c9c0c49152', // ← Account SID
      '9a9309814c11117129b360d8a176dcc3',    // ← Auth Token
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

