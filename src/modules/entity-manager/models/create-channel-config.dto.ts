import { OmitType } from '@nestjs/mapped-types';
import { DeepPartial } from 'typeorm';

import { ChannelConfigEntity } from '@/modules/database/entities/channel-config.entity';

import { ChannelConfigDto } from './channel-config.dto';

export class CreateChannelConfigDto extends OmitType(ChannelConfigDto, [
  'id',
  'companyToken',
  'toEntity',
] as const) {
  toEntity(
    override?: DeepPartial<ChannelConfigDto | ChannelConfigEntity>,
  ): DeepPartial<ChannelConfigEntity> {
    return {
      channel: this.channel,
      broker: this.broker,
      status: this.status,
      ...override,
    };
  }
}
