# Test suite map

| Automated test | Type | What it verifies | Data source |
|---|---|---|---|
| `tests/ui/store.spec.js` | UI | Rendering, search, empty search result, sorting, reset, cart operations (add/increment/decrement/delete/clear), persistence, API error state | Mocked GET response |
| `tests/api/products.spec.js` — GET | API | HTTP status, content type, array schema, required fields, field types, values, unique IDs | Live Fake Store API |
| `tests/api/products.spec.js` — POST | API | Successful response convention, JSON response, submitted fields, returned ID | Live Fake Store API |

UI tests are intentionally isolated from the live third-party API. API tests are integration checks against an external demo service and can fail or be blocked if that service is unavailable.
