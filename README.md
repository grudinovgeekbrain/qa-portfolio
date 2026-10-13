# QA Portfolio — Web, API и UI-автоматизация

Учебный проект для демонстрации навыков ручного и автоматизированного тестирования веб-приложения и REST API.

## О проекте

Объект тестирования — демонстрационный интернет-магазин `web-testing/online_market.html`. Каталог загружается из Fake Store API. На странице есть поиск и сортировка товаров, корзина и сохранение состояния корзины в `localStorage`.

В репозитории представлены чек-лист, функциональные тест-кейсы, баг-репорты, API-тест-кейсы и автоматизация с Playwright.

> Это учебный проект. Он не имитирует реальную оплату. Fake Store API — внешний демонстрационный сервис, и успешный ответ POST не доказывает постоянное сохранение записи. UI-тесты используют локально подменённый ответ каталога; API-тесты обращаются к внешнему endpoint.

## Возможности и область тестирования

### Web UI
- загрузка каталога и состояние ошибки;
- поиск по части названия;
- сортировка по цене;
- сброс поиска и сортировки;
- добавление товара в корзину;
- увеличение и уменьшение количества, удаление позиции;
- сохранение корзины после перезагрузки.

### API
- `GET https://fakestoreapi.com/products` — статус, Content-Type, форма JSON, обязательные поля, типы, базовая валидность значений и уникальность ID;
- `POST https://fakestoreapi.com/products` — отправка тестового payload и проверка ответа.

### Automation
- Playwright UI tests с mock-ответом API для стабильности;
- Playwright API tests для внешнего Fake Store API;
- HTML-отчёт, трассировка и скриншоты при ошибках;
- GitHub Actions для UI-тестов.

## Технологии

- JavaScript / Node.js;
- Playwright Test;
- HTTP, REST, JSON;
- HTML, CSS, DOM, Chrome DevTools;
- чек-листы, тест-кейсы и баг-репорты;
- Git, GitHub Actions.

## Установка

Требуется Node.js LTS и npm.

```bash
npm install
npx playwright install chromium
```

## Запуск тестов

```bash
npm test            # все тесты; API требует доступа к интернету
npm run test:ui     # UI-тесты с mock API, без обращения UI к внешнему сервису
npm run test:api    # API-тесты против Fake Store API, нужен интернет
npm run test:headed # UI-тесты в видимом браузере
npm run test:report # открыть HTML-отчёт последнего запуска
```

Playwright сам поднимет локальный статический сервер для приложения. Не нужно отдельно открывать HTML через `file://`.

## Структура репозитория

```text
qa-portfolio/
├── .github/workflows/playwright.yml
├── api-testing/
│   ├── postman/qa-portfolio.postman_collection.json
│   └── test-cases/
│       ├── products-get.md
│       └── products-post.md
├── docs/
│   ├── api-checklist.md
│   ├── api-testing-guide.md
│   ├── automation-guide.md
│   └── project-walkthrough.md
├── scripts/static-server.js
├── tests/
│   ├── api/products.spec.js
│   └── ui/store.spec.js
├── web-testing/
│   ├── online_market.html
│   ├── checklist/smoke-checklist.md
│   ├── test-cases/web-functional-test-cases.md
│   └── bug-reports/
├── package.json
└── playwright.config.js
```

## Документация

- [Smoke-чек-лист](web-testing/checklist/smoke-checklist.md)
- [Функциональные UI-тест-кейсы](web-testing/test-cases/web-functional-test-cases.md)
- [API-001 — GET products](api-testing/test-cases/products-get.md)
- [API-002 — POST product](api-testing/test-cases/products-post.md)
- [Postman collection and instructions](api-testing/postman/README.md)
- [Подробный гайд по API-тестированию](docs/api-testing-guide.md)
- [Таблица-шпаргалка API-проверок](docs/api-checklist.md)
- [Как устроена автоматизация](docs/automation-guide.md)
- [Обзор кода приложения](docs/project-walkthrough.md)

## Как читать результаты

- `Passed` — тест действительно выполнен и все проверки прошли.
- `Failed` — выполненный тест обнаружил несоответствие.
- `Blocked` — тест нельзя выполнить, например из-за недоступности необходимого окружения.
- `Not run` — сценарий ещё не выполнялся.

Не записывайте предполагаемые ответы в фактический результат. Для ручных проверок фиксируйте реальный ответ, скриншот или другие доказательства. Для баг-репорта нужны шаги воспроизведения, ожидаемый и фактический результат, окружение и оценка дефекта.

## Текущие ограничения

- API-тесты зависят от стороннего сервиса и требуют доступа к интернету.
- UI-тесты с mock проверяют поведение страницы при предсказуемых данных, а не доступность реального API.
- Проект учебный; нет backend, собственной базы данных или реального процесса оплаты.
- Текущий демонстрационный HTML — объект тестирования, поэтому потенциальные найденные дефекты в нём не исправляются автоматически без отдельного решения.
