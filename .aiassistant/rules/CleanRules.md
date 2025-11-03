---
적용: 항상
---

## Architecture Overview

This is a pnpm monorepo for a financial web application. The structure is
divided into `apps` and `packages`.

- **`apps/web`**: The main Next.js frontend application. It uses the App Router
  and is the primary entry point for users.
- **`packages/*`**: Reusable libraries that encapsulate specific domains of
  functionality.

### Key Packages

- **`packages/finance-core`**: Contains the core business logic for financial
  data, including services (`financialService.ts`) for fetching market data and
  utility functions for data transformation (`chartTransform.ts`).
- **`packages/finance-ui`**: A library of React components specifically for
  displaying financial data, such as `AssetChart.tsx` and `MarketViewer.tsx`.
- **`packages/ui`**: A general-purpose UI component library based on shadcn/ui.
  Use components from here for common UI elements.
- **`packages/store`**: Manages global state using React Context. `AppProviders`
  in `apps/web/src/store/AppProvider.tsx` wraps the entire application to
  provide shared services and state.
- **`packages/auth-core`**: Handles user authentication logic and API routes.
- **`packages/hooks`**: Contains shared React hooks used across the application.

### Architectural Principles

The project aims to follow the principles of **Clean Architecture**. This means
that the codebase is organized into layers with a strict dependency rule: source
code dependencies can only point inwards.

- **Entities & Use Cases (Core Business Logic)**: Found within the
  `packages/*-core` libraries (e.g., `finance-core`). This layer contains the
  application's business rules and should have no dependencies on any outer
  layer.
- **Interface Adapters**: This layer includes API routes (`/api` folders within
  core packages) which act as controllers, and parts of the state management
  (`packages/store`) that prepare data for the UI.
- **Frameworks & Drivers**: The outermost layer consists of the Next.js
  application (`apps/web`), UI component libraries (`packages/ui`,
  `packages/finance-ui`), and connections to external services or databases.

This separation ensures that the core business logic is independent of the UI,
database, or any specific framework, making the system easier to maintain, test,
and scale.

## Developer Workflow

### Running the Application

- To install dependencies, run `pnpm install` from the root directory.
- To start the web development server, run `pnpm --filter web dev`.

### Coding Conventions

- **Data Flow**: Services in `*-core` packages fetch data. This data is often
  managed by the global state in the `store` package and consumed by UI
  components in `apps/web` or `finance-ui`.
- **Component Structure**: Follow the patterns in `packages/ui` (based on
  shadcn/ui) for creating new UI components. Financial-specific components
  should go into `packages/finance-ui`.
- **State Management**: For global state, use the context providers defined in
  `packages/store`. For local component state, use React's built-in state
  management (`useState`, `useReducer`).
- **API Routes**: Backend logic is exposed via API routes defined within the
  `*-core` packages (e.g., `packages/finance-core/src/api/routes.ts`). These are
  integrated into the Next.js app.
- **Error Handling**: Use the centralized `error-handler` package to manage and
  report errors consistently.

### Frontend Development Rules

- **Thinking Process**: First think step-by-step. Describe your plan for what to
  build in pseudocode, written out in great detail. Then, write the code.
- **Code Quality**: Write correct, best-practice, DRY, bug-free, and fully
  functional code. Focus on readability over performance. Leave no TODOs or
  placeholders.
- **Styling**: Always use Tailwind CSS classes for styling. Avoid plain CSS or
  `<style>` tags.
- **Naming**: Use descriptive variable and function names. Event handlers should
  be prefixed with `handle`, e.g., `handleClick`.
- **Accessibility**: Implement accessibility features on elements (e.g.,
  `tabindex`, `aria-label`, keyboard events).
- **Function Style**: Use `const` for function components and arrow functions,
  e.g., `const MyComponent = () => ...`. Define types where possible.
- **Readability**: Use early returns to improve code readability.
