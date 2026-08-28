# SkyMessaging (#101)

SkyMessaging is a bounded engineering-beta messaging domain core for SKYCOIN4444.

## Capability

- Validates conversation, sender, request, and message-body inputs.
- Produces deterministic per-conversation sequence numbers.
- Supports idempotent client-message retries.
- Exposes bounded cursor-style history reads.
- Defines versioned integration contracts: `sky.messaging.send.v1` and `sky.messaging.receipt.v1`.

## Integration path

Adapters can translate authenticated SKYCOIN4444 API requests into `SendMessageCommand` values and persist or transport returned receipts through an external storage/event layer. This repository does not claim to provide those external layers.

## Security and product boundaries

This implementation is process-local and in-memory. It does not provide authentication, authorization, encryption-at-rest, durable persistence, delivery guarantees, push notifications, moderation, tenant isolation, external messaging providers, production deployment, or compliance certification.
