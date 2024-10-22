import { MessageDirection, MessageStatus } from '@/models/enums';

import {
  RcsMessageCarouselContentDto,
  RcsMessageDocumentContentDto,
  RcsMessageImageContentDto,
  RcsMessageRichCardContentDto,
  RcsMessageTextContentDto,
  RcsMessageVideoContentDto,
} from './rsc-message.dto';

export enum SyncEventType {
  MESSAGE = 'message',
  STATUS = 'status',
}

export type SyncModel = {
  eventType: SyncEventType;
  direction: MessageDirection;
  status: MessageStatus;
  message?:
    | RcsMessageCarouselContentDto
    | RcsMessageImageContentDto
    | RcsMessageDocumentContentDto
    | RcsMessageRichCardContentDto
    | RcsMessageTextContentDto
    | RcsMessageVideoContentDto;
  referenceChatId: string;
  messageId: string;
  errorMessage?: string;
  date: Date;
};
