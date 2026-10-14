# Postman: Fake Store API

## Import
1. Open Postman.
2. Select **Import**.
3. Import `qa-portfolio.postman_collection.json`.
4. Open the collection and run either request with **Send**.

## Included requests
- **GET /products** — checks status, JSON Content-Type, non-empty array, required fields, basic types and values, and unique IDs.
- **POST /products** — sends a test product and checks the allowed success status (200 or 201), JSON response, submitted fields, and numeric ID.

The requests use the public Fake Store API, so an internet connection is required. The service is a demo API: a successful POST response does not prove that the record is persistently stored.

The collection is a manual Postman counterpart to `tests/api/products.spec.js`. A test status is meaningful only after the request has actually been sent and its assertions have executed.
