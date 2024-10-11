import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EXCHANGE_NAMES } from '@/config/constants';
import { EnvVars } from '@/config/env-vars';
import { BrokerType, ChannelType } from '@/modules/database/entities/enums';

import { RcsMessageModel } from '../models/rsc-message.model';
import { OutboundRcsProducer } from '../producers/outbound-rcs.producer';

@Injectable()
export class OutboundRcsConsumer {
  constructor(
    private readonly configService: ConfigService<EnvVars>,
    private readonly outboundRcsProducer: OutboundRcsProducer,
  ) {}

  private readonly logger = new Logger(OutboundRcsConsumer.name);

  @RabbitRPC({
    exchange: EXCHANGE_NAMES.OUTBOUND,
    routingKey: `${ChannelType.RCS}.${BrokerType.PONTAL_TECH}`,
    queue: `ms-channels-gateway.${ChannelType.RCS}.${BrokerType.PONTAL_TECH}`,
    createQueueIfNotExists: true,
    queueOptions: {
      durable: true,
      autoDelete: true,
      deadLetterExchange: EXCHANGE_NAMES.OUTBOUND_DLX,
    },
  })
  public async rcsPontalTechHandler(message: RcsMessageModel) {
    this.logger.log('rcsPontalTechHandler :: Message received', message);
    return await this.outboundRcsProducer.publish(message);
  }
}
