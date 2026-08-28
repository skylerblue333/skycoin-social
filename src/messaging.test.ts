import { InMemoryMessagingCore } from './messaging';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const core = new InMemoryMessagingCore();
const now = new Date('2026-08-27T00:00:00.000Z');
const first = core.send({
  type: 'sky.messaging.send.v1',
  requestId: 'req-1',
  draft: { conversationId: 'conv-1', senderId: 'user-1', body: 'hello', clientMessageId: 'client-1' },
}, now);
assert(first.duplicate === false, 'first send must not be duplicate');
assert(first.message.sequence === 1, 'first message sequence must be 1');
assert(first.message.createdAt === now.toISOString(), 'timestamp must be deterministic');

const duplicate = core.send({
  type: 'sky.messaging.send.v1',
  requestId: 'req-2',
  draft: { conversationId: 'conv-1', senderId: 'user-1', body: 'hello again', clientMessageId: 'client-1' },
}, new Date('2026-08-28T00:00:00.000Z'));
assert(duplicate.duplicate === true, 'client id retry must be duplicate');
assert(duplicate.message.id === first.message.id, 'duplicate must return original message');

const second = core.send({
  type: 'sky.messaging.send.v1',
  requestId: 'req-3',
  draft: { conversationId: 'conv-1', senderId: 'user-2', body: 'reply' },
}, now);
assert(second.message.sequence === 2, 'second message sequence must be 2');
assert(core.history('conv-1').length === 2, 'history must contain two messages');
assert(core.history('conv-1', 1, 1)[0]?.id === second.message.id, 'cursor history must return second message');

let rejected = false;
try {
  core.send({ type: 'sky.messaging.send.v1', requestId: 'req-4', draft: { conversationId: 'conv-1', senderId: 'user-1', body: '   ' } });
} catch {
  rejected = true;
}
assert(rejected, 'blank message must be rejected');
console.log('SkyMessaging tests passed');
