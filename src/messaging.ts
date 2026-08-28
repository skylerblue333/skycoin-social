export type MessageId = string;
export type ConversationId = string;
export type PrincipalId = string;

export interface MessageDraft {
  conversationId: ConversationId;
  senderId: PrincipalId;
  body: string;
  clientMessageId?: string;
}

export interface MessageRecord {
  id: MessageId;
  conversationId: ConversationId;
  senderId: PrincipalId;
  body: string;
  sequence: number;
  createdAt: string;
  clientMessageId?: string;
}

export interface SendMessageCommand {
  type: 'sky.messaging.send.v1';
  requestId: string;
  draft: MessageDraft;
}

export interface SendMessageReceipt {
  type: 'sky.messaging.receipt.v1';
  requestId: string;
  message: MessageRecord;
  duplicate: boolean;
}

function requireText(value: string, field: string, max: number): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  if (normalized.length > max) throw new Error(`${field} exceeds ${max} characters`);
  return normalized;
}

export class InMemoryMessagingCore {
  private readonly conversations = new Map<ConversationId, MessageRecord[]>();
  private readonly idempotency = new Map<string, MessageRecord>();
  private nextId = 1;

  send(command: SendMessageCommand, now = new Date()): SendMessageReceipt {
    if (command.type !== 'sky.messaging.send.v1') throw new Error('unsupported command type');
    const requestId = requireText(command.requestId, 'requestId', 128);
    const conversationId = requireText(command.draft.conversationId, 'conversationId', 128);
    const senderId = requireText(command.draft.senderId, 'senderId', 128);
    const body = requireText(command.draft.body, 'body', 4000);
    const clientMessageId = command.draft.clientMessageId?.trim() || undefined;
    const key = clientMessageId ? `${conversationId}:${senderId}:${clientMessageId}` : requestId;
    const existing = this.idempotency.get(key);
    if (existing) {
      return { type: 'sky.messaging.receipt.v1', requestId, message: existing, duplicate: true };
    }

    const list = this.conversations.get(conversationId) ?? [];
    const message: MessageRecord = {
      id: `msg_${this.nextId++}`,
      conversationId,
      senderId,
      body,
      sequence: list.length + 1,
      createdAt: now.toISOString(),
      ...(clientMessageId ? { clientMessageId } : {}),
    };
    list.push(message);
    this.conversations.set(conversationId, list);
    this.idempotency.set(key, message);
    return { type: 'sky.messaging.receipt.v1', requestId, message, duplicate: false };
  }

  history(conversationId: ConversationId, afterSequence = 0, limit = 100): MessageRecord[] {
    const id = requireText(conversationId, 'conversationId', 128);
    if (!Number.isInteger(afterSequence) || afterSequence < 0) throw new Error('afterSequence must be a non-negative integer');
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('limit must be between 1 and 100');
    return (this.conversations.get(id) ?? []).filter((m) => m.sequence > afterSequence).slice(0, limit).map((m) => ({ ...m }));
  }
}
