# API-002 — Создание товара

## Endpoint
POST /products

## Цель
Проверить создание товара через API и обработку различных вариантов входных данных.

## Позитивный сценарий

### Валидные данные

Отправлены:

```json
{
  "title": "QA Test Product",
  "price": 100,
  "description": "Test product created for API testing",
  "category": "electronics"
}