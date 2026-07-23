# Project Philosophy

Aair Tasks is structured as a small production application rather than a screen-level exercise. The implementation favors maintainability, modularity, accessibility, strict typing, graceful degradation, and a clear path to scale.

## Architecture decisions

Every decision follows the same template: problem, options, chosen solution, rationale, trade-offs, rejected alternatives, scalability, performance, security, maintainability, future improvements, interview answer, and follow-ups. The condensed decision register below keeps those answers close to the code.

| Decision      | Chosen solution                                  | Why / trade-off                                                                                                |
| ------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Framework     | Expo                                             | Fast cross-platform setup and native primitives; native speech recognition needs a development build.          |
| Language      | Strict TypeScript                                | Safer refactors and explicit contracts; more deliberate code.                                                  |
| State         | Redux Toolkit                                    | Predictable reducers, selectors, devtools, and testability; more ceremony than local state.                    |
| Navigation    | React Navigation                                 | Typed stacks and native transitions; Expo Router is an alternative for file-based routing/deep links.          |
| Storage       | AsyncStorage behind a service                    | Simple offline persistence; migrate to SQLite for indexing and very large datasets.                            |
| Services      | Storage, speech, and AI interfaces               | Screens stay declarative and providers are replaceable; adds clear boundaries.                                 |
| Hooks         | `useTasks`, `useTheme`                           | Reusable orchestration and easier testing; hooks must not become business-logic monoliths.                     |
| Forms         | React Hook Form + Zod                            | Low re-render form state and runtime validation; schema parsing adds a small concept cost.                     |
| AI            | `AIProvider` / `OpenAIProvider`                  | Deterministic prompts, response validation, and parser fallback; production should proxy requests server-side. |
| Voice         | `speech.service.ts`                              | Keeps native recognition replaceable; Expo Go reports a recoverable limitation.                                |
| Theme         | System default with persisted override           | Consistent tokens and no component color literals; transition animation can be enhanced.                       |
| Accessibility | Roles, labels, live region, 44dp targets         | Makes primary flows usable with VoiceOver/TalkBack; requires device verification.                              |
| Performance   | FlatList, memoized cards, derived filtering      | Efficient for large ordinary lists; FlashList/SQLite are future options.                                       |
| Errors        | Friendly errors and fallback parser              | Graceful degradation without stack traces; offline AI cannot be guaranteed.                                    |
| Security      | Central config and untrusted-response validation | No secrets in source; client-side API keys are not suitable for production.                                    |
| Tests         | Reducers and parser first                        | High-value pure logic coverage; integration/device tests are next.                                             |
| Git/docs      | Conventional milestones and README/Choice.md     | Reviewable history and onboarding; docs must stay synchronized.                                                |

## Reusable decision template

**Problem** — Keep UI independent from platform and network concerns.

**Options Considered** — Put logic in screens, use a global store only, or use typed services plus hooks.

**Chosen Solution** — UI → hooks → Redux/services → storage/API.

**Why It Was Chosen** — Each layer has one reason to change and can be tested in isolation.

**Trade-offs** — More files and indirection in exchange for replacement and testability.

**Alternatives Rejected** — Direct AsyncStorage/API calls from components.

**Scalability** — Repositories, sync, notifications, and auth can be inserted behind existing boundaries.

**Performance Impact** — FlatList, memoized rows, and derived selectors keep rendering bounded.

**Security Impact** — Secrets and response parsing stay outside UI code.

**Maintainability** — Naming and types make ownership visible.

**Future Improvements** — SQLite, offline operation queue, backend AI proxy, native speech provider.

**Interview Answer** — “I isolated unstable I/O behind interfaces so the product can evolve without rewriting the screens.”

**Possible Follow-up Questions** — When would you simplify this?

**Suggested Answer** — If the app remained one screen, local state could be enough; the chosen structure earns its cost once features cross screen and platform boundaries.

## Interview Questions & Answers

1. **Why Redux for a small app?** — The task model is cross-screen and persistence-aware, so predictable transitions are valuable.
2. **Would Context be enough?** — For theme, yes; for task updates and future sync, RTK is more observable.
3. **Why not Zustand?** — It is a good choice, but RTK is a standardized team-friendly pattern with strong tooling.
4. **Why services?** — They make I/O mockable and providers replaceable.
5. **How would this scale to 100,000 users?** — Add auth, API sync, conflict resolution, SQLite, pagination, telemetry, and a server AI proxy.
6. **How would cloud sync work?** — Use revisions/updated timestamps and an explicit conflict policy.
7. **How would offline support improve?** — Persist an operation queue in SQLite and replay it on reconnect.
8. **Why validate AI output?** — External output is untrusted and may be malformed.
9. **Why temperature zero?** — Extraction should be repeatable, not creative.
10. **Why not call OpenAI from a screen?** — That couples UI to credentials, transport, and response shape.
11. **What is the voice limitation?** — Expo Go has no speech recognition; the service returns a recovery message and typed fallback.
12. **How are secrets handled?** — `.env.example` has placeholders; production keys belong in build/server config.
13. **When SQLite?** — When JSON serialization or querying becomes a measurable bottleneck.
14. **Why Zod?** — Runtime validation with inferred types.
15. **Why React Hook Form?** — Efficient field updates and a clean schema boundary.
16. **Why allow duplicate titles?** — Two identical actions can be legitimate; IDs remain unique.
17. **How does search behave?** — It derives visible results and never mutates stored state.
18. **Why immutable sorting?** — Canonical insertion order stays intact.
19. **How do you handle malformed storage?** — Defensive parsing falls back to an empty list.
20. **What would you test next?** — Storage failures, navigation flows, accessibility, and provider contracts.
21. **Why no snapshots?** — Behavioral tests are less brittle and more valuable here.
22. **How would notifications fit?** — A notification service consumes due-date changes.
23. **How would you support reduced motion?** — Centralize motion policy and disable non-essential animations from accessibility settings.
24. **Why memoize TaskCard?** — Independent list rows should not rerender unnecessarily.
25. **Why FlatList?** — Virtualized rendering is safer than mapping thousands of rows.
26. **How would categories fit?** — Extend the task model and add a selector/filter without changing card ownership.
27. **How do you preserve storage compatibility?** — Normalize older records at the storage boundary.
28. **What is graceful degradation?** — Core tasks still work when AI or voice is unavailable.
29. **How would you log failures?** — Use a redacted, environment-aware logger.
30. **Why typed routes?** — Navigation parameters become compile-time contracts.
31. **How do screens avoid business logic?** — Hooks and services own orchestration; screens compose UI.
32. **What is the main future risk?** — Persistence orchestration should eventually move to middleware/repository as consumers grow.
33. **How would undo delete work?** — A transient snackbar stores and restores the deleted task.
34. **How would you measure performance?** — Profile startup, frame time, list interaction, and storage latency on representative devices.
35. **How would shared lists work?** — Add ownership and sync while keeping task presentation reusable.
36. **Why one icon library?** — Consistent geometry and a smaller design-system surface.
37. **How would CI work?** — Install lockfile, typecheck, lint, test, then build a preview artifact.
38. **What must never be committed?** — Keys, device artifacts, generated secrets, or fake screenshots.
39. **How would pagination work?** — Repository-level page loading with the UI unaware of transport.
40. **How would tablets work?** — Responsive max-width containers and adaptive columns.
41. **What makes a good reducer?** — Small deterministic transitions with no I/O.
42. **What is the strongest trade-off?** — More structure than a demo in exchange for replaceability and reviewability.
43. **Why Expo over bare RN?** — Faster setup now; development builds preserve a path to native modules.
44. **Why strict mode?** — It catches nullability and contract drift before runtime.
45. **Why not MobX/Recoil?** — RTK has a clearer team convention and simpler debugging story.
46. **How would authentication change the app?** — Add an auth feature and repository; task UI contracts remain stable.
47. **How would you protect an OpenAI key?** — Never ship it in the client; call a controlled backend.
48. **Why persist theme separately?** — Preferences are independent of task lifecycle.
49. **How do due dates remain extensible?** — Tasks store ISO dates; presentation derives labels from them.
50. **What would you improve with more time?** — Native recognition, swipe/undo, SQLite, device integration tests, and real screenshots.

## Reviewer Questions

- **Would you still choose Redux?** Yes for cross-screen domain state; not for local form state.
- **Why services?** They isolate unstable I/O and enable contract tests.
- **How would you support cloud sync?** Add a repository and conflict-aware sync engine behind the hook contract.
- **How would you improve offline support?** Add a durable operation queue and connectivity replay.
- **What changes for auth?** Add identity and scoped repositories without coupling screens to credentials.

## What I Would Improve With More Time

Native speech recognition, development-build configuration, SQLite migration, notifications, sync conflict UI, reduced-motion support, integration tests, and real device screenshot coverage.

## Key Engineering Principles Used

SOLID · DRY · KISS · separation of concerns · composition · strong typing · accessibility · progressive enhancement · graceful degradation · performance optimization · modular architecture · production readiness.
