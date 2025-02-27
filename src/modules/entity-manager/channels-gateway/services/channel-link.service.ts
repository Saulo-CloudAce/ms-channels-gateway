import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { ChannelLinkRepository } from '@/modules/database/channels-gateway/repositories/channel-link.repository';
import { ChannelLinkDto } from '@/modules/entity-manager/channels-gateway/models/channel-link.dto';
import { CreateChannelLinkDto } from '@/modules/entity-manager/channels-gateway/models/create-channel-link.dto';
import { UpdateChannelLinkDto } from '@/modules/entity-manager/channels-gateway/models/update-channel-link.dto';

@Injectable()
export class ChannelLinkService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly channelLinkRepository: ChannelLinkRepository,
  ) {}

  async getById(id: string) {
    const cacheKey = CacheKeyBuilder.getById({ id });

    const cached = await this.cacheManager.get<ChannelLinkDto>(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await this.channelLinkRepository
      .getById(id)
      .then(ChannelLinkDto.fromEntity);

    if (data) {
      this.cacheManager.set(cacheKey, data);
    }

    return data;
  }

  async getAllByReference(referenceId: string) {
    const cacheKey = CacheKeyBuilder.getAllByReference({ referenceId });

    const cached = await this.cacheManager.get<ChannelLinkDto>(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await this.channelLinkRepository
      .getAllByReference(referenceId)
      .then((rows) => rows?.map(ChannelLinkDto.fromEntity));

    if (data) {
      this.cacheManager.set(cacheKey, data);
    }

    return data;
  }

  async create(dto: CreateChannelLinkDto) {
    return await this.channelLinkRepository
      .create(dto.toEntity())
      .then(ChannelLinkDto.fromEntity);
  }

  async update(id: string, dto: UpdateChannelLinkDto) {
    const data = await this.channelLinkRepository.update(id, dto.toEntity());

    this.cacheManager.del(CacheKeyBuilder.getById({ id }));
    this.cacheManager.del(
      CacheKeyBuilder.getAllByReference({ referenceId: dto.referenceId }),
    );

    return data;
  }

  async delete(id: string) {
    const data = await this.getById(id);

    await this.channelLinkRepository.delete(id);

    this.cacheManager.del(CacheKeyBuilder.getById({ id }));
    this.cacheManager.del(
      CacheKeyBuilder.getAllByReference({ referenceId: data.referenceId }),
    );
  }
}

class CacheKeyBuilder {
  static getById({ id }: { id: string }) {
    return `ms-channels-gateway:channel-config:id-${id}`;
  }

  static getAllByReference({ referenceId }: { referenceId: string }) {
    return `ms-channels-gateway:channel-config:referenceId-${referenceId}`;
  }
}
