[README.md](https://github.com/user-attachments/files/33638912/README.md)
# Newtonite

### Enterprise Task Management & Incident Workflow Engine

```{=html}
<p align="center">
```
`<strong>`{=html}Centralized task coordination, incident reporting,
approvals, and role-based access control.`</strong>`{=html}
```{=html}
</p>
```
> **Project status:** Deployed frontend and backend; verify production
> API connectivity and authentication before treating the full
> application as production-ready.

------------------------------------------------------------------------

## Table of Contents

1.  [Overview](#1-overview)
2.  [Objectives and Features](#2-objectives-and-features)
3.  [Technology Stack](#3-technology-stack)
4.  [System Architecture](#4-system-architecture)
5.  [Roles and Permissions](#5-roles-and-permissions)
6.  [Core Workflows](#6-core-workflows)
7.  [Project Structure](#7-project-structure)
8.  [Installation and Local Setup](#8-installation-and-local-setup)
9.  [Environment Configuration](#9-environment-configuration)
10. [Build, Test, and Deployment](#10-build-test-and-deployment)
11. [Data and API Design Notes](#11-data-and-api-design-notes)
12. [Troubleshooting](#12-troubleshooting)
13. [Security Notes](#13-security-notes)
14. [Roadmap](#14-roadmap)

------------------------------------------------------------------------

## 1. Overview

**Newtonite** is a web-based task management and incident workflow
application designed to help teams organize work, report issues, assign
responsibility, and manage approvals through role-based access control
(RBAC).

The interface includes a sign-in screen and an instant demo-access
concept with seeded personas (`employ1` through `employ20`). The demo is
intended to help evaluators explore different roles and team boundaries
without requiring public sign-up.

The application is split into a frontend and a backend:

-   **Frontend:** React with Vite, deployed on Vercel.
-   **Backend:** Node.js service, deployed on Render.
-   **API communication:** The frontend reads `VITE_API_URL` and appends
    `/api` to form its API base URL.
-   **Data layer:** Configured through the backend project. Confirm the
    actual database and provider from the backend configuration before
    documenting or changing it.

### Project goals

-   Keep tasks and incidents in one place.
-   Make ownership, status, and priority easier to understand.
-   Support different permissions for viewers, members, leads, and
    administrators.
-   Provide a clear workflow for reporting, reviewing, assigning, and
    resolving work.
-   Offer a deployable web interface with a separately hosted API.

------------------------------------------------------------------------

## 2. Objectives and Features

  -----------------------------------------------------------------------
  Area                    Purpose                 Notes
  ----------------------- ----------------------- -----------------------
  Authentication          Sign in with configured Requires a reachable
                          credentials             backend API

  Demo access             Explore seeded demo     Personas are shown in
                          personas                the login UI

  Task management         Organize work and track Confirm available
                          status                  actions in the running
                                                  app

  Incident workflow       Record and follow up on Workflow rules are
                          incidents               backend-dependent

  Role-based access       Restrict actions by     Viewer, Member, Lead,
                          role                    Admin

  Team boundaries         Keep team actions       Validate with multiple
                          scoped appropriately    demo personas

  Deployment              Host UI and API         Vercel frontend +
                          separately              Render backend
  -----------------------------------------------------------------------

### Feature map

``` mermaid
mindmap
  root((Newtonite))
    Access
      Sign in
      Demo personas
      Role-based permissions
    Work management
      Tasks
      Assignment
      Status tracking
    Incident workflow
      Report incident
      Review
      Resolution
    Administration
      User and team boundaries
      Approval workflows
    Delivery
      Vercel frontend
      Render API
```

------------------------------------------------------------------------

## 3. Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend framework      React                   UI components and
                                                  client-side interaction

  Frontend build tool     Vite                    Development server and
                                                  production build

  Frontend                TypeScript compiler     Type-checking during
  language/tooling        (`tsc`)                 build

  Frontend hosting        Vercel                  Static frontend
                                                  deployment

  Backend runtime         Node.js                 API service runtime

  Backend hosting         Render                  Hosting and running the
                                                  API service

  API configuration       `VITE_API_URL`          Supplies the backend
                                                  origin to the frontend

  Database/provider       Backend-configured      Check backend
                                                  environment and
                                                  Prisma/schema files for
                                                  the exact provider
  -----------------------------------------------------------------------

> **Important:** Do not guess the database provider or API endpoints.
> Confirm them from the backend configuration and route files before
> adding them to project documentation.

------------------------------------------------------------------------

## 4. System Architecture

The browser loads the frontend from Vercel. The frontend sends API
requests to the Render backend. The backend validates requests, applies
authorization rules, and accesses the configured data store.

``` mermaid
flowchart TD
    U[User / Browser] --> V[Vercel: React + Vite frontend]
    V --> E[VITE_API_URL environment variable]
    E --> A[Render: Node.js backend]
    A --> AU[Authentication and authorization]
    AU --> B[Task and incident workflows]
    B --> DB[(Configured data store)]
    A --> R[JSON API responses]
    R --> V
```

### Production URLs

  Component                       URL / setting
  ------------------------------- ------------------------------------------------
  Frontend project                `https://newtonite-ops-23131012067.vercel.app`
  Backend service                 `https://newtonite-backendd.onrender.com`
  Frontend environment variable   `VITE_API_URL`
  API base URL pattern            `${VITE_API_URL}/api`

The URLs above reflect the deployment values used during setup. If your
deployment domain changes, update this table and the relevant Vercel
configuration.

### Request lifecycle

``` mermaid
sequenceDiagram
    actor User
    participant UI as React frontend
    participant API as Render backend
    participant Data as Configured data store
    User->>UI: Submit login or workflow action
    UI->>API: HTTP request under /api
    API->>API: Validate request and permissions
    API->>Data: Read or update records
    Data-->>API: Result
    API-->>UI: JSON response and status
    UI-->>User: Display result or error
```

------------------------------------------------------------------------

## 5. Roles and Permissions

The login page describes these key RBAC roles. The table below is a
**planning/validation guide**, not a substitute for the actual
authorization rules implemented in the backend.

  Capability                              Viewer             Member               Lead    Admin
  ------------------------------- -------------- ------------------ ------------------ --------
  View permitted workspace data              Yes                Yes                Yes      Yes
  Create or update own work         No / limited             Verify             Verify   Verify
  Assign work to teammates                    No   Limited / verify             Verify   Verify
  Review team workflow                        No       No / limited             Verify   Verify
  Manage users or team settings               No                 No   Limited / verify   Verify

**Validation checklist**

-   [ ] Viewer cannot perform write actions unless explicitly allowed.
-   [ ] Member actions are limited to the intended scope.
-   [ ] Lead permissions are restricted to the appropriate team.
-   [ ] Admin-only operations reject non-admin requests.
-   [ ] API authorization is enforced on the server, not only by hiding
    UI buttons.
-   [ ] A user cannot access another team's data by changing an
    identifier in a request.

------------------------------------------------------------------------

## 6. Core Workflows

### 6.1 Sign-in workflow

1.  User opens the deployed frontend.
2.  User enters a configured email/persona and password.
3.  Frontend sends the authentication request to the backend API.
4.  Backend validates credentials and returns the result.
5.  Frontend routes the user to the appropriate workspace when
    authentication succeeds.

### 6.2 Task workflow

``` mermaid
stateDiagram-v2
    [*] --> Created
    Created --> Assigned: Owner assigned
    Assigned --> InProgress: Work starts
    InProgress --> Review: Ready for review
    Review --> InProgress: Changes requested
    Review --> Completed: Approved
    Created --> Cancelled: Cancelled if permitted
    Assigned --> Cancelled: Cancelled if permitted
    Completed --> [*]
    Cancelled --> [*]
```

Use the diagram as a suggested workflow. Keep it aligned with the actual
states implemented by the application.

### 6.3 Incident workflow

1.  A user reports an incident with the available details.
2.  The backend validates the request and stores it.
3.  An authorized user reviews and assigns the incident.
4.  The responsible person updates progress and resolution notes.
5.  The incident is closed when the implemented workflow permits it.

### Demo credentials note

The login screen shown during development displays demo personas
`employ1` to `employ20` and a default password of `123456`. These are
**demo-only credentials**. Verify the exact email format and account
setup in the seed/configuration code. Never use these credentials for
real users or production accounts.

------------------------------------------------------------------------

## 7. Project Structure

The repository contains at least a `frontend` folder and a backend
service. A typical structure may look like this; filenames can differ in
your actual repository.

``` text
newtonite/
├── frontend/
│   ├── src/
│   │   └── api/
│   │       └── client.ts
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
└── backend/
    ├── package.json
    ├── prisma/             # If Prisma is used by this backend
    └── ...                 # API routes, services, configuration
```

### Key frontend API configuration

In `frontend/src/api/client.ts`, the code currently uses the following
pattern:

``` ts
const rawApiUrl = (import.meta as any).env?.VITE_API_URL;
const BASE_URL = rawApiUrl ? `${rawApiUrl.replace(/\/$/, '')}/api` : '/api';
```

This means:

-   If `VITE_API_URL` is set, the client uses that backend origin plus
    `/api`.
-   If it is missing, the client falls back to `/api` on the frontend's
    own origin.
-   The environment variable should contain the backend origin only,
    without a trailing `/api`.

------------------------------------------------------------------------

## 8. Installation and Local Setup

### Prerequisites

-   Node.js version compatible with the versions in the project's
    `package.json`.
-   npm.
-   Git.
-   Access to the backend environment variables and configured database,
    if required.

Check installed versions:

``` bash
node --version
npm --version
```

### Frontend setup

From the repository root:

``` bash
cd frontend
npm install
```

Create or configure the frontend environment file if the project
requires one:

``` env
VITE_API_URL=http://localhost:5000
```

Replace `5000` with the actual local backend port. Do not assume the
port without checking backend configuration.

Start the frontend development server:

``` bash
npm run dev
```

Run the production build locally:

``` bash
npm run build
```

### Backend setup

Open a second terminal and move into the backend folder:

``` bash
cd backend
npm install
```

Review the backend `package.json` scripts and its environment
configuration. Start the backend using the script defined in that file,
for example:

``` bash
npm run dev
```

> The exact backend command, port, database migration steps, and
> required variables depend on the repository configuration. Use the
> scripts and README/configuration already present in `backend` as the
> source of truth.

------------------------------------------------------------------------

## 9. Environment Configuration

### Vercel frontend variable

In **Vercel → Project → Settings → Environment Variables**, configure:

  -------------------------------------------------------------------------------------------
  Key                     Value                                       Environment
  ----------------------- ------------------------------------------- -----------------------
  `VITE_API_URL`          `https://newtonite-backendd.onrender.com`   Production (and Preview
                                                                      if needed)

  -------------------------------------------------------------------------------------------

Because the variable uses the `VITE_` prefix, its value is exposed to
browser-side code. A backend base URL is generally fine to expose;
**never place passwords, private API keys, database URLs, or other
secrets in a `VITE_` variable**.

After changing a Vercel environment variable, redeploy the frontend so
the new value is included in the build.

### Render backend variables

Set backend secrets and configuration in the Render service's
environment settings. The exact variable names must be taken from
backend code and deployment configuration.

Examples of values that a backend may require include:

-   Database connection URL.
-   Authentication/session secret.
-   Runtime environment such as `NODE_ENV`.
-   Any service-specific configuration required by the application.

Do not paste secret values into README files, Git commits, screenshots,
or public issue reports.

------------------------------------------------------------------------

## 10. Build, Test, and Deployment

### Deployment overview

  -----------------------------------------------------------------------
  Step              Platform          Action            Expected result
  ----------------- ----------------- ----------------- -----------------
  1                 GitHub            Push the intended Repository
                                      commit            contains current
                                                        code

  2                 Render            Build and deploy  Service reports
                                      backend           `Live`

  3                 Vercel            Build and deploy  Deployment
                                      frontend          reports `Ready`

  4                 Vercel settings   Configure         Frontend targets
                                      `VITE_API_URL`    Render API

  5                 Browser           Open deployed URL UI loads

  6                 Browser / API     Test login and    Requests succeed
                    tools             API calls         with expected
                                                        responses
  -----------------------------------------------------------------------

### Build checks

Run in `frontend`:

``` bash
npm install --include=dev
npm run build
```

A successful local build verifies the frontend compilation and bundling.
It does **not** prove that the production backend URL, CORS rules,
credentials, or database operations are correct.

### Suggested smoke-test matrix

  -----------------------------------------------------------------------
  Test                    Expected result         Status
  ----------------------- ----------------------- -----------------------
  Frontend URL opens      Login page renders      To verify

  Render service status   `Live`                  To verify at test time

  Backend API             Expected response       Confirm actual route
  health/known route                              first

  Login with valid seeded Authentication succeeds To verify
  account                                         

  Login with invalid      Clear rejection         To verify
  password                                        

  Role-restricted action  Unauthorized role is    To verify
                          rejected                

  Task/incident update    Data persists as        To verify
                          expected                
  -----------------------------------------------------------------------

### Useful deployment diagnostics

-   **`Failed to fetch`:** Check the `VITE_API_URL` value, backend
    availability, browser Network tab, CORS configuration, and the
    requested API path.
-   **`404 Not Found`:** Confirm the route exists and whether the
    backend expects the `/api` prefix.
-   **`401` or `403`:** Inspect credentials, session/token handling, and
    authorization rules.
-   **`500` response:** Check Render logs and backend/database
    configuration.
-   **Vercel build fails:** Inspect the last lines of the deployment
    build log; distinguish dependency/permission errors from warnings.

------------------------------------------------------------------------

## 11. Data and API Design Notes

The frontend's API client constructs the base path as `/api` appended to
`VITE_API_URL`. Therefore, inspect the backend route definitions before
writing down specific endpoint names.

Recommended API documentation table to complete from the actual route
files:

  -----------------------------------------------------------------------
  Method            Endpoint          Purpose           Auth required
  ----------------- ----------------- ----------------- -----------------
  `POST`            Confirm from      Sign-in           Usually yes/no
                    backend routes                      depending on
                                                        route

  `GET`             Confirm from      Current user or   Confirm
                    backend routes    workspace data    

  `GET` / `POST`    Confirm from      Task operations   Confirm
                    backend routes                      

  `GET` / `POST`    Confirm from      Incident          Confirm
                    backend routes    operations        
  -----------------------------------------------------------------------

### Data integrity recommendations

-   Validate request bodies on the server.
-   Apply authorization checks before returning or changing records.
-   Use consistent error response formats.
-   Record relevant timestamps for creation and updates.
-   Prevent duplicate submissions where workflow rules require it.
-   Add indexes to frequently queried fields where appropriate.
-   Never trust role names or user IDs supplied by the browser without
    server-side verification.

------------------------------------------------------------------------

## 12. Troubleshooting

  --------------------------------------------------------------------------
  Symptom                    Likely area to check    First action
  -------------------------- ----------------------- -----------------------
  `Failed to fetch` on login URL, CORS, API          Inspect browser Network
                             availability            tab and Render logs

  Frontend loads but API     Environment variable or Verify `VITE_API_URL`
  fails                      route                   and `/api` handling

  Vercel build reports       Install/build           Check install scripts
  `tsc: Permission denied`   environment             and build logs; compare
                                                     lockfile and Node
                                                     versions

  Render build fails         Backend build           Read the first actual
                             configuration           error in Render logs

  Service is `Live` but      Route, CORS, auth, or   Test the real login
  login fails                data store              endpoint and inspect
                                                     backend logs

  Changes don't appear after Deployment              Redeploy after saving
  variable update                                    environment variables
  --------------------------------------------------------------------------

### CORS reminder

If the browser reports a CORS error, configure the backend to allow the
exact deployed frontend origin. Avoid opening CORS to every origin
unless the project intentionally requires it and the security
implications are understood.

------------------------------------------------------------------------

## 13. Security Notes

-   Demo credentials are for evaluation only; do not treat them as
    production credentials.
-   Do not commit `.env` files or secrets.
-   Keep database credentials and authentication secrets on the backend.
-   Enforce role permissions on the server for every protected
    operation.
-   Validate and sanitize user input.
-   Use HTTPS for deployed services.
-   Avoid logging passwords, tokens, or sensitive user data.
-   Configure CORS for known frontend origins.
-   Review seeded accounts and remove or disable demo accounts before
    any real-world deployment.

------------------------------------------------------------------------

## 14. Roadmap

  -----------------------------------------------------------------------
  Priority                Improvement             Acceptance criteria
  ----------------------- ----------------------- -----------------------
  High                    Confirm production      Login API succeeds from
                          frontend-to-backend     deployed frontend
                          connectivity            

  High                    Verify role-based       Each role is tested
                          access                  against allowed and
                                                  denied actions

  High                    Confirm error handling  API failures show
                                                  useful messages

  Medium                  Document actual API     Methods, paths,
                          routes                  payloads, and responses
                                                  are recorded

  Medium                  Add automated tests     Critical authentication
                                                  and workflow paths are
                                                  covered

  Medium                  Add health monitoring   Backend failures can be
                                                  diagnosed quickly

  Later                   Improve reporting and   Dashboard metrics match
                          analytics               persisted data

  Later                   Add deployment checks   Builds and tests run
                          to CI                   before release
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Contributing

1.  Create a feature branch.
2.  Make focused changes.
3.  Run the frontend build and applicable backend tests.
4.  Check that no secrets or local environment files are committed.
5.  Open a pull request describing the change and how it was tested.

## License

Add the project's chosen license here before distributing the repository
publicly.

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<strong>`{=html}Newtonite --- organize work, coordinate teams, and
manage incidents with clarity.`</strong>`{=html}
```{=html}
</p>
```
