# Whop API Reference

**Base URL:** `https://api.whop.com/api/v1`

**Authentication:** Include your API key in the `Authorization` header using Bearer scheme:
```
Authorization: Bearer YOUR_API_KEY
```

**API Key Types:**
- **Company API Keys:** For accessing data for your own company or connected accounts
- **App API Keys:** For apps that need to access data from companies that have installed your app

---

## PAYINS

### Products

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/products` | `access_pass:basic:read` | List products for a company |
| POST | `/products` | `access_pass:basic:write` | Create a new product |
| GET | `/products/{id}` | `access_pass:basic:read` | Retrieve a specific product |
| PATCH | `/products/{id}` | `access_pass:basic:write` | Update a product |
| DELETE | `/products/{id}` | `access_pass:basic:write` | Delete a product |

**Key Parameters:**
- `company_id` (required): Filter by company
- `product_types`: Filter by type (regular, app, experience_upsell, api_only)
- `visibilities`: Filter by visibility (visible, hidden, archived, quick_link)
- `order`: Sort by (active_memberships_count, created_at, usd_gmv, usd_gmv_30_days)
- `direction`: Sort direction (asc, desc)
- `created_before`, `created_after`: Date filters

---

### Plans

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/plans` | `plan:basic:read` | List plans |
| POST | `/plans` | `plan:basic:write` | Create a new plan |
| GET | `/plans/{id}` | `plan:basic:read` | Retrieve a specific plan |
| PATCH | `/plans/{id}` | `plan:basic:write` | Update a plan |
| DELETE | `/plans/{id}` | `plan:basic:write` | Delete a plan |

---

### Payments

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/payments` | `payment:basic:read` | List payments |
| POST | `/payments` | `payment:basic:write` | Create a payment |
| GET | `/payments/{id}` | `payment:basic:read` | Retrieve a specific payment |
| GET | `/payments/{id}/fees` | `payment:basic:read` | List fees for a payment |
| POST | `/payments/{id}/refund` | `payment:basic:write` | Refund a payment |
| POST | `/payments/{id}/retry` | `payment:basic:write` | Retry a failed payment |
| POST | `/payments/{id}/void` | `payment:basic:write` | Void a payment |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `payment.created` | Fired when a payment is created |
| `payment.succeeded` | Fired when a payment succeeds |
| `payment.failed` | Fired when a payment fails |
| `payment.pending` | Fired when a payment is pending |

---

### Refunds

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/refunds` | `refund:basic:read` | List refunds |
| GET | `/refunds/{id}` | `refund:basic:read` | Retrieve a specific refund |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `refund.created` | Fired when a refund is created |
| `refund.updated` | Fired when a refund is updated |

---

### Disputes

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/disputes` | `dispute:basic:read` | List disputes |
| GET | `/disputes/{id}` | `dispute:basic:read` | Retrieve a specific dispute |
| POST | `/disputes/{id}/submit_evidence` | `dispute:basic:write` | Submit evidence for a dispute |
| POST | `/disputes/{id}/update_evidence` | `dispute:basic:write` | Update evidence for a dispute |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `dispute.created` | Fired when a dispute is created |
| `dispute.updated` | Fired when a dispute is updated |

---

### Checkout Configurations

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/checkout_configurations` | `checkout_configuration:basic:read` | List checkout configurations |
| POST | `/checkout_configurations` | `checkout_configuration:basic:write` | Create a checkout configuration |
| GET | `/checkout_configurations/{id}` | `checkout_configuration:basic:read` | Retrieve a checkout configuration |

---

### Setup Intents

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/setup_intents` | `setup_intent:basic:read` | List setup intents |
| GET | `/setup_intents/{id}` | `setup_intent:basic:read` | Retrieve a setup intent |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `setup_intent.requires_action` | Fired when setup intent requires action |
| `setup_intent.succeeded` | Fired when setup intent succeeds |
| `setup_intent.canceled` | Fired when setup intent is canceled |

---

### Payment Methods

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/payment_methods` | `payment_method:basic:read` | List payment methods |
| GET | `/payment_methods/{id}` | `payment_method:basic:read` | Retrieve a payment method |

---

### Invoices

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/invoices` | `invoice:basic:read` | List invoices |
| POST | `/invoices` | `invoice:basic:write` | Create an invoice |
| GET | `/invoices/{id}` | `invoice:basic:read` | Retrieve a specific invoice |
| POST | `/invoices/{id}/void` | `invoice:basic:write` | Void an invoice |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `invoice.created` | Fired when an invoice is created |
| `invoice.paid` | Fired when an invoice is paid |
| `invoice.past_due` | Fired when an invoice is past due |
| `invoice.voided` | Fired when an invoice is voided |

---

### Promo Codes

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/promo_codes` | `promo_code:basic:read` | List promo codes |
| POST | `/promo_codes` | `promo_code:basic:write` | Create a promo code |
| GET | `/promo_codes/{id}` | `promo_code:basic:read` | Retrieve a promo code |
| DELETE | `/promo_codes/{id}` | `promo_code:basic:write` | Delete a promo code |

---

## PAYOUTS

### Ledger Accounts

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/ledger_accounts/{id}` | `ledger_account:basic:read` | Retrieve a ledger account |

---

### Transfers

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/transfers` | `transfer:basic:read` | List transfers |
| POST | `/transfers` | `transfer:basic:write` | Create a transfer |
| GET | `/transfers/{id}` | `transfer:basic:read` | Retrieve a transfer |

---

### Withdrawals

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/withdrawals` | `withdrawal:basic:read` | List withdrawals |
| POST | `/withdrawals` | `withdrawal:basic:write` | Create a withdrawal |
| GET | `/withdrawals/{id}` | `withdrawal:basic:read` | Retrieve a withdrawal |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `withdrawal.created` | Fired when a withdrawal is created |
| `withdrawal.updated` | Fired when a withdrawal is updated |

---

### Payout Methods

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/payout_methods` | `payout_method:basic:read` | List payout methods |
| GET | `/payout_methods/{id}` | `payout_method:basic:read` | Retrieve a payout method |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `payout_method.created` | Fired when a payout method is created |

---

### Verifications

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/verifications/{id}` | `verification:basic:read` | Retrieve a verification |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `verification.succeeded` | Fired when verification succeeds |

---

### Topups

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| POST | `/topups` | `topup:basic:write` | Create a topup |

---

## IDENTITY

### Users

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/users/{id}` | `user:basic:read` | Retrieve a user (public endpoint for basic info) |
| GET | `/users/{id}/check_access` | `user:basic:read` | Check user access to a product |

---

### Companies

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/companies` | `company:basic:read` | List companies |
| POST | `/companies` | `company:basic:write` | Create a company |
| GET | `/companies/{id}` | `company:basic:read` | Retrieve a company |
| PATCH | `/companies/{id}` | `company:basic:write` | Update a company |

---

### Authorized Users

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/authorized_users` | `authorized_user:basic:read` | List authorized users |
| GET | `/authorized_users/{id}` | `authorized_user:basic:read` | Retrieve an authorized user |

---

### Fee Markups

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/fee_markups` | `fee_markup:basic:read` | List fee markups |
| POST | `/fee_markups` | `fee_markup:basic:write` | Create a fee markup |
| DELETE | `/fee_markups/{id}` | `fee_markup:basic:write` | Delete a fee markup |

---

## CRM

### Members

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/members` | `member:basic:read` | List members |
| GET | `/members/{id}` | `member:basic:read` | Retrieve a member |

---

### Memberships

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/memberships` | `membership:basic:read` | List memberships |
| GET | `/memberships/{id}` | `membership:basic:read` | Retrieve a membership |
| PATCH | `/memberships/{id}` | `membership:basic:write` | Update a membership |
| POST | `/memberships/{id}/cancel` | `membership:basic:write` | Cancel a membership |
| POST | `/memberships/{id}/pause` | `membership:basic:write` | Pause a membership |
| POST | `/memberships/{id}/resume` | `membership:basic:write` | Resume a paused membership |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `membership.activated` | Fired when a membership is activated |
| `membership.deactivated` | Fired when a membership is deactivated |
| `membership.cancel_at_period_end_changed` | Fired when cancel at period end changes |

---

### Leads

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/leads` | `lead:basic:read` | List leads |
| POST | `/leads` | `lead:basic:write` | Create a lead |
| GET | `/leads/{id}` | `lead:basic:read` | Retrieve a lead |
| PATCH | `/leads/{id}` | `lead:basic:write` | Update a lead |

---

### Entries

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/entries` | `entry:basic:read` | List entries |
| GET | `/entries/{id}` | `entry:basic:read` | Retrieve an entry |
| POST | `/entries/{id}/approve` | `entry:basic:write` | Approve an entry |
| POST | `/entries/{id}/deny` | `entry:basic:write` | Deny an entry |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `entry.created` | Fired when an entry is created |
| `entry.approved` | Fired when an entry is approved |
| `entry.denied` | Fired when an entry is denied |
| `entry.deleted` | Fired when an entry is deleted |

---

### Shipments

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/shipments` | `shipment:basic:read` | List shipments |
| POST | `/shipments` | `shipment:basic:write` | Create a shipment |
| GET | `/shipments/{id}` | `shipment:basic:read` | Retrieve a shipment |

---

### Reviews

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/reviews` | `review:basic:read` | List reviews |
| GET | `/reviews/{id}` | `review:basic:read` | Retrieve a review |

---

## ENGAGEMENT

### Experiences

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/experiences` | `experience:basic:read` | List experiences |
| POST | `/experiences` | `experience:basic:write` | Create an experience |
| GET | `/experiences/{id}` | `experience:basic:read` | Retrieve an experience |
| PATCH | `/experiences/{id}` | `experience:basic:write` | Update an experience |
| DELETE | `/experiences/{id}` | `experience:basic:write` | Delete an experience |
| POST | `/experiences/{id}/attach` | `experience:basic:write` | Attach experience to a product |
| POST | `/experiences/{id}/detach` | `experience:basic:write` | Detach experience from a product |
| POST | `/experiences/{id}/duplicate` | `experience:basic:write` | Duplicate an experience |

---

### Forums

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/forums` | `forum:basic:read` | List forums |
| GET | `/forums/{id}` | `forum:basic:read` | Retrieve a forum |
| PATCH | `/forums/{id}` | `forum:basic:write` | Update a forum |

---

### Forum Posts

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/forum_posts` | `forum_post:basic:read` | List forum posts |
| POST | `/forum_posts` | `forum_post:basic:write` | Create a forum post |
| GET | `/forum_posts/{id}` | `forum_post:basic:read` | Retrieve a forum post |
| PATCH | `/forum_posts/{id}` | `forum_post:basic:write` | Update a forum post |

---

### Chat Channels

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/chat_channels` | `chat_channel:basic:read` | List chat channels |
| GET | `/chat_channels/{id}` | `chat_channel:basic:read` | Retrieve a chat channel |
| PATCH | `/chat_channels/{id}` | `chat_channel:basic:write` | Update a chat channel |

---

### Support Channels

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/support_channels` | `support_channel:basic:read` | List support channels |
| POST | `/support_channels` | `support_channel:basic:write` | Create a support channel |
| GET | `/support_channels/{id}` | `support_channel:basic:read` | Retrieve a support channel |

---

### Messages

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/messages` | `message:basic:read` | List messages |
| POST | `/messages` | `message:basic:write` | Create a message |
| GET | `/messages/{id}` | `message:basic:read` | Retrieve a message |
| PATCH | `/messages/{id}` | `message:basic:write` | Update a message |

---

### Reactions

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/reactions` | `reaction:basic:read` | List reactions |
| POST | `/reactions` | `reaction:basic:write` | Create a reaction |
| GET | `/reactions/{id}` | `reaction:basic:read` | Retrieve a reaction |

---

### Notifications

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| POST | `/notifications` | `notification:basic:write` | Create a notification |

---

## COURSES

### Courses

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/courses` | `course:basic:read` | List courses |
| POST | `/courses` | `course:basic:write` | Create a course |
| GET | `/courses/{id}` | `course:basic:read` | Retrieve a course |
| PATCH | `/courses/{id}` | `course:basic:write` | Update a course |
| DELETE | `/courses/{id}` | `course:basic:write` | Delete a course |

---

### Course Chapters

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/course_chapters` | `course_chapter:basic:read` | List course chapters |
| POST | `/course_chapters` | `course_chapter:basic:write` | Create a course chapter |
| GET | `/course_chapters/{id}` | `course_chapter:basic:read` | Retrieve a course chapter |
| PATCH | `/course_chapters/{id}` | `course_chapter:basic:write` | Update a course chapter |
| DELETE | `/course_chapters/{id}` | `course_chapter:basic:write` | Delete a course chapter |

---

### Course Lessons

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/course_lessons` | `course_lesson:basic:read` | List course lessons |
| POST | `/course_lessons` | `course_lesson:basic:write` | Create a course lesson |
| GET | `/course_lessons/{id}` | `course_lesson:basic:read` | Retrieve a course lesson |
| PATCH | `/course_lessons/{id}` | `course_lesson:basic:write` | Update a course lesson |
| DELETE | `/course_lessons/{id}` | `course_lesson:basic:write` | Delete a course lesson |
| POST | `/course_lessons/{id}/mark_as_completed` | `course_lesson:basic:write` | Mark lesson as completed |
| POST | `/course_lessons/{id}/start` | `course_lesson:basic:write` | Start a course lesson |
| POST | `/course_lessons/{id}/submit_assessment` | `course_lesson:basic:write` | Submit lesson assessment |

---

### Course Students

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/course_students` | `course_student:basic:read` | List course students |
| GET | `/course_students/{id}` | `course_student:basic:read` | Retrieve a course student |

---

### Course Lesson Interactions

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/course_lesson_interactions` | `course_lesson_interaction:basic:read` | List course lesson interactions |
| GET | `/course_lesson_interactions/{id}` | `course_lesson_interaction:basic:read` | Retrieve a course lesson interaction |

**Webhooks:**
| Event | Description |
|-------|-------------|
| `course_lesson_interaction.completed` | Fired when a lesson interaction is completed |

---

## DEVELOPER

### Apps

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/apps` | `app:basic:read` | List apps |
| POST | `/apps` | `app:basic:write` | Create an app |
| GET | `/apps/{id}` | `app:basic:read` | Retrieve an app |
| PATCH | `/apps/{id}` | `app:basic:write` | Update an app |

---

### Webhooks

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/webhooks` | `webhook:basic:read` | List webhooks |
| POST | `/webhooks` | `webhook:basic:write` | Create a webhook |
| GET | `/webhooks/{id}` | `webhook:basic:read` | Retrieve a webhook |
| PATCH | `/webhooks/{id}` | `webhook:basic:write` | Update a webhook |
| DELETE | `/webhooks/{id}` | `webhook:basic:write` | Delete a webhook |

---

### App Builds

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/app_builds` | `app_build:basic:read` | List app builds |
| POST | `/app_builds` | `app_build:basic:write` | Create an app build |
| GET | `/app_builds/{id}` | `app_build:basic:read` | Retrieve an app build |
| POST | `/app_builds/{id}/promote` | `app_build:basic:write` | Promote an app build |

---

### Files

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/files/{id}` | `file:basic:read` | Retrieve a file |
| POST | `/files` | `file:basic:write` | Create/upload a file |

---

### Access Tokens

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| POST | `/access_tokens` | `access_token:basic:write` | Create an access token |

---

### Account Links

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| POST | `/account_links` | `account_link:basic:write` | Create an account link |

---

## Pagination

All list endpoints support cursor-based pagination with the following parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `after` | string | Returns elements after the specified cursor |
| `before` | string | Returns elements before the specified cursor |
| `first` | integer | Returns the first n elements |
| `last` | integer | Returns the last n elements |

**Response Structure:**
```json
{
  "data": [...],
  "page_info": {
    "end_cursor": "string",
    "start_cursor": "string",
    "has_next_page": boolean,
    "has_previous_page": boolean
  }
}
```

---

## SDKs

Whop provides official SDKs:

- **TypeScript/JavaScript:** `pnpm install @whop/sdk`
- **Python:** `pip install whop-sdk`
- **Ruby:** `gem install whop_sdk`

---

## MCP Server

Access the API via MCP server:
- Cursor: `https://mcp.whop.com/mcp`
- Claude: `https://mcp.whop.com/sse`

---

## Endpoint Count Summary

| Category | Endpoints | Webhooks |
|----------|-----------|----------|
| Products | 5 | 0 |
| Plans | 5 | 0 |
| Payments | 7 | 4 |
| Refunds | 2 | 2 |
| Disputes | 4 | 2 |
| Checkout Configurations | 3 | 0 |
| Setup Intents | 2 | 3 |
| Payment Methods | 2 | 0 |
| Invoices | 4 | 4 |
| Promo Codes | 4 | 0 |
| Ledger Accounts | 1 | 0 |
| Transfers | 3 | 0 |
| Withdrawals | 3 | 2 |
| Payout Methods | 2 | 1 |
| Verifications | 1 | 1 |
| Topups | 1 | 0 |
| Users | 2 | 0 |
| Companies | 4 | 0 |
| Authorized Users | 2 | 0 |
| Fee Markups | 3 | 0 |
| Members | 2 | 0 |
| Memberships | 6 | 3 |
| Leads | 4 | 0 |
| Entries | 4 | 4 |
| Shipments | 3 | 0 |
| Reviews | 2 | 0 |
| Experiences | 8 | 0 |
| Forums | 3 | 0 |
| Forum Posts | 4 | 0 |
| Chat Channels | 3 | 0 |
| Support Channels | 3 | 0 |
| Messages | 4 | 0 |
| Reactions | 3 | 0 |
| Notifications | 1 | 0 |
| Courses | 5 | 0 |
| Course Chapters | 5 | 0 |
| Course Lessons | 8 | 0 |
| Course Students | 2 | 0 |
| Course Lesson Interactions | 2 | 1 |
| Apps | 4 | 0 |
| Webhooks | 5 | 0 |
| App Builds | 4 | 0 |
| Files | 2 | 0 |
| Access Tokens | 1 | 0 |
| Account Links | 1 | 0 |

**Total: 143 REST API Endpoints + 27 Webhook Events**

---

*Documentation generated from https://docs.whop.com/developer/api*
*Last updated: 2025-01-24*
