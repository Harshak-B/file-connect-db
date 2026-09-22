# Brand Creator Connect

## Beam — Production-Ready Creator Marketplace MVP

A web-based marketplace where brands publish campaigns, creators receive transparent match scores, apply, collaborate, and complete a tracked payout workflow.

### Target Users

- Brands hiring creators for campaigns.

- Creators discovering and applying to relevant briefs.

- Admins reviewing users, campaigns, applications, payments, and disputes.

### Core MVP Scope

- Real account registration and login with secure password hashing, JWT/session handling, and role-based access.

- Brand and creator profiles with editable campaign-matching data.

- Brand campaign creation, editing, closing, and reopening.

- Creator campaign discovery with filters and match-score breakdowns.

- Applications with duplicate prevention, pitch validation, withdrawal rules, and status history.

- Brand review workflow: applied → review → accepted/rejected → in progress → completed.

- Notifications for applications, invitations, status changes, and payout events.

- Admin dashboard for moderation, user/campaign management, audit history, and dispute status.

- Payment abstraction with Stripe test-mode checkout/escrow-style milestone simulation; failed-payment and webhook states included.

- Email integration through a replaceable adapter, using a sandbox/test provider where practical.

- File/deliverable metadata and upload abstraction; use local storage in development and object storage in deployment.

- Responsive redesign preserving Beam’s warm editorial identity while improving hierarchy, dashboard density, mobile navigation, form states, accessibility, loading states, empty states, and error feedback.

### User Flow

1. User signs up as a brand or creator and completes role-specific onboarding.

2. Brand posts a campaign with category, platform, audience requirements, budget, location, brief, and deliverables.

3. Matching service scores eligible creators and exposes the score explanation.

4. Creator filters briefs, reviews budget and requirements, and submits one application.

5. Brand reviews ranked applications, accepts or rejects candidates, and optionally invites creators.

6. Accepted work moves through tracked milestones with deliverable submission metadata.

7. Brand confirms completion; payment enters a Stripe test-mode release flow.

8. Notifications, email events, audit records, and payment/webhook status remain visible to both parties and admins.

### Hardened Business Rules

- Closed campaigns reject new applications; existing pending applications remain reviewable or are explicitly marked closed by policy.

- Application match scores are snapshotted at submission; profile edits affect future applications, not historical decisions.

- A creator can apply only once per campaign; invitations are idempotent and cannot create duplicate applications.

- A campaign may define a creator limit or budget allocation; accepting a creator reserves that allocation.

- Status transitions are server-validated, role-checked, auditable, and cannot skip required milestones without an admin override.

- Payout failures create a retryable payment state; no UI action claims money was released until a verified webhook confirms it.

- Disputes pause completion/payout and require admin resolution.

- Account deletion anonymizes required financial/audit records while removing personal profile data where legally appropriate.

- Every mutation validates ownership and authorization on the backend; the client is never trusted.

### Tech Stack

- Frontend: React + TypeScript, using the existing HTML/CSS visual direction as the migration reference.

- Backend: FastAPI with Pydantic schemas, JWT authentication, role-based authorization, service-layer business rules, and OpenAPI documentation.

- Database: MongoDB with indexes for users, campaigns, applications, notifications, payments, and audit events.

- Payments: Stripe test mode behind a payment-provider interface.

- Email: Resend or SendGrid behind an email adapter; console adapter for local development.

- Storage: object-storage interface with local development adapter and deployable provider adapter.

- Testing/deployment: Docker Compose for local React/FastAPI/MongoDB development, automated API/unit/integration tests, and a public frontend/backend/database deployment with environment-based secrets.

### Implementation Phases

1. **Foundation:** split the current localStorage prototype into React and FastAPI, define MongoDB schemas, configure Docker Compose, environment variables, migrations/index creation, logging, and error handling.

2. **Auth and profiles:** registration, login, password hashing, JWT/session lifecycle, role guards, onboarding, profile editing, and account lifecycle.

3. **Marketplace workflows:** campaigns, creator discovery, matching service, applications, invitations, status transitions, notifications, and audit logs.

4. **Completion layer:** deliverable metadata, payment-provider interface, Stripe test-mode checkout/webhooks, failed-payment states, email adapter, and admin moderation/disputes.

5. **UI hardening:** migrate Beam’s styling into reusable React components, improve responsive layouts, accessibility, skeleton/loading states, validation, toasts, confirmations, and destructive-action safeguards.

6. **Verification and release:** seed demo accounts/data, API and workflow tests, security review, webhook testing, Dockerized local setup, public deployment, README, architecture diagram, and interview-ready demo script.

### Explicit Assumptions

- This is a web app, not a mobile app.

- The goal is a credible portfolio MVP, not a legally complete marketplace or production escrow business.

- Stripe test mode and sandbox/mock adapters are acceptable; real money movement, legal contracts, identity verification, and social-metric verification are outside MVP.

- The existing prototype’s visual identity is retained, but its localStorage data model and client-only authorization are replaced entirely.

- Initial currency and payout geography remain configurable until you choose a market; payment behavior should not be hard-coded around demo data.

### Definition of Done

A new user can register publicly, create or discover a campaign, submit and review an application, progress a collaboration through authorized states, trigger a verified test payment/webhook, receive notifications, and demonstrate the complete flow from a public deployment. Admins can inspect and intervene in every sensitive workflow, and the README explains all real versus simulated integrations.

I have attached 2 screenshots of preview

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7cfa9f41-568d-4bbc-8d9a-96f6bafa9769).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
