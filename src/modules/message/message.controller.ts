import { Body, Controller, Post } from '@nestjs/common';

import { OutboundMessageDto } from '@/models/outbound-message.model';

import { OutboundProducer } from './producers/outbound.producer';
import { RcsMessageDto } from '@/models/rsc-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly outboundProducer: OutboundProducer) {}

  @Post('publish')
  async publish(
    @Body()
    body: OutboundMessageDto,
  ) {
    return this.outboundProducer.publish(body);
  }
}
