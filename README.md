# Skycoin Social

Social/community component candidate for the SKYCOIN4444 ecosystem.

## Current repository evidence

- Public TypeScript repository on `main`.
- 27 tracked files were observed in the current audit snapshot.
- `package.json`, Docker configuration, Docker Compose configuration, and GitHub Actions CI configuration are present.
- No test-related filename was detected by the current audit.

## Ecosystem role

**Supporting Services → Community / Social**

This repository is a candidate source for user profiles, communities, social interactions, and related application behavior. Messaging/realtime functionality should be consolidated with the canonical ShadowChat/realtime boundary instead of duplicated here.

## Truthful status

- Source/configuration: **present**
- Canonical integration: **pending implementation comparison**
- Automated tests: **not established by the current repository evidence**
- Production deployment: **not verified**
- Live social network: **not claimed**

The current package metadata calls the module production-grade, but its build suppresses TypeScript failures and its test/lint commands only print success. Those scripts are not evidence that validation passes. fileciteturn161file0

## Consolidation approach

Preserve the existing TypeScript implementation and configuration. Compare profile, community, feed, notification, messaging, and moderation capabilities against ShadowChat, frontend, identity, security, and other social implementations. Consolidate shared capabilities into their canonical boundaries rather than maintaining duplicate services.

If a missing capability requires a mature public open-source foundation, evaluate it for license compatibility, security, maintenance, and integration fit before adoption. Preserve attribution and isolate third-party dependencies behind stable interfaces.

## Production requirements

Before production promotion, establish real tests, strict build/type validation, identity/auth integration, moderation and abuse controls, privacy boundaries, rate limiting, notification reliability, observability, reproducible CI, and end-to-end deployment verification.

## License

See the checked-in repository license and applicable third-party dependency licenses.
