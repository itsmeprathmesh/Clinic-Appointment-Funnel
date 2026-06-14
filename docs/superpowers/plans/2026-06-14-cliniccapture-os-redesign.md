# ClinicCapture OS Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved ClinicCapture OS patient-facing redesign while preserving booking, admin, chatbot, analytics, local cache, and dark-mode behavior.

**Architecture:** Keep the existing Vite React app and state ownership in `App.jsx`. Add focused reusable UI components for badges, flow panels, service cards, doctor cards, booking stepper, FAQ accordion, trust/security, and final CTA, then restyle existing page components around them without changing core data flow.

**Tech Stack:** React 19, Vite, lucide-react, CSS custom properties, CSS animations, existing localStorage utilities, existing mock data.

---

### Task 1: Shared Design System And UI Primitives

**Files:**
- Modify: `src/index.css`
- Create: `src/components/ui/StatusBadge.jsx`
- Create: `src/components/ui/TrustBadge.jsx`
- Create: `src/components/ui/FlowCard.jsx`

- [ ] **Step 1: Add UI primitive files**

Create `StatusBadge`, `TrustBadge`, and `FlowCard` components that receive props and render existing lucide icons or passed icons without owning app state.

- [ ] **Step 2: Extend global CSS tokens**

Update `src/index.css` with ClinicCapture OS tokens, section utilities, animation helpers, responsive grid helpers, dark-mode values, mobile sticky CTA spacing, and reduced-motion overrides.

- [ ] **Step 3: Verify imports compile**

Run: `npm run build`

Expected: Vite build completes or reports only issues introduced by following tasks not yet done.

### Task 2: App Shell, Navbar, Additional Sections

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Navbar.jsx`
- Create: `src/components/VerifiedCredentials.jsx`
- Create: `src/components/TrustSecurity.jsx`
- Create: `src/components/FinalCTA.jsx`
- Create: `src/components/FAQAccordion.jsx`

- [ ] **Step 1: Add new static sections**

Create verified credentials, FAQ, trust/security, and final CTA sections using existing booking scroll handlers and `nextAvailableSlot`.

- [ ] **Step 2: Update app page order**

Update `App.jsx` patient view order to: `Hero`, `VerifiedCredentials`, `ProviderProfile`, `Services`, `BookingFunnel`, `FAQAccordion`, `TrustSecurity`, `FinalCTA`.

- [ ] **Step 3: Add mobile sticky booking CTA**

Render a mobile-only sticky booking button in the patient view that calls `scrollToBooking`.

- [ ] **Step 4: Restyle navbar**

Preserve `isAdmin`, `setIsAdmin`, `nextAvailableSlot`, and `onBookNowClick` props while converting the navbar into a compact sticky glass OS bar.

### Task 3: Hero Acquisition Flow

**Files:**
- Modify: `src/components/Hero.jsx`

- [ ] **Step 1: Replace hero layout**

Use the exact approved copy and CTA labels. Build the right-side `Active Acquisition Flow` panel with three vertical steps, icons, status badges, animated progress line, and dashboard-like supporting UI.

- [ ] **Step 2: Preserve interactions**

Keep `onBookNowClick` wired to primary CTA and `onExploreProvidersClick` wired to secondary CTA.

### Task 4: Doctor Profile Workspace

**Files:**
- Modify: `src/components/ProviderProfile.jsx`
- Create: `src/components/ui/DoctorCard.jsx`

- [ ] **Step 1: Add doctor card and availability timeline**

Keep provider selection, video controls, credentials, and CV tab state. Add doctor cards and an availability timeline fed by static display data.

- [ ] **Step 2: Restyle profile layout**

Convert the section into a medical OS workspace with distinct profile, media, credentials, and CV areas.

### Task 5: Services And Reviews

**Files:**
- Modify: `src/components/Services.jsx`
- Create: `src/components/ui/ServiceCard.jsx`

- [ ] **Step 1: Add horizontal service cards**

Create `ServiceCard` and wire it to `onSelectServiceForBooking` and active review filtering.

- [ ] **Step 2: Restyle reviews**

Keep review filtering behavior while presenting reviews as a trust feed rather than a repeated card grid.

### Task 6: Booking Funnel Restyle

**Files:**
- Modify: `src/components/BookingFunnel.jsx`
- Create: `src/components/ui/BookingStepper.jsx`

- [ ] **Step 1: Add booking stepper**

Create `BookingStepper` that accepts `step` and renders triage, insurance, schedule, confirm states.

- [ ] **Step 2: Restyle each booking step**

Keep all current state, validation, cache, insurance, slot, and submit logic. Change only layout/classes/labels where needed for the secure OS form container.

- [ ] **Step 3: Preserve success path**

Complete a booking manually after implementation and confirm success modal data is still populated.

### Task 7: Admin, Chatbot, Responsive, And Dark Mode Polish

**Files:**
- Modify: `src/components/AdminDashboard.jsx`
- Modify: `src/components/Chatbot.jsx`
- Modify: `src/index.css`

- [ ] **Step 1: Lightly align admin visuals**

Keep admin behavior unchanged. Adjust section shell, status badges, and panel styling to match the OS theme.

- [ ] **Step 2: Polish chatbot**

Keep chatbot behavior unchanged. Update visual tone to match the redesigned patient UI.

- [ ] **Step 3: Responsive audit**

Add CSS media queries so hero, provider profile, services, booking form, navbar, chatbot, and admin views avoid horizontal overflow.

### Task 8: Verification

**Files:**
- No production file changes unless verification reveals a defect.

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: exit code 0.

- [ ] **Step 2: Run build**

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 3: Run local app**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite dev server starts.

- [ ] **Step 4: Manual browser verification**

Verify the public page, booking CTA scroll, specialists CTA scroll, dark mode toggle, chatbot open/send, booking flow through success modal, admin toggle, and admin waitlist cancellation flow.

- [ ] **Step 5: Final diff review**

Run: `git status --short` and review changed files before final response.

## Self-Review

Spec coverage:

- Hero, navbar, verified credentials, doctor profile, services, booking flow, FAQ, trust/security, final CTA, mobile CTA, dark mode, and light admin alignment are covered.
- Functional preservation requirements are covered by tasks 2, 3, 5, 6, 7, and 8.
- Verification commands are covered in task 8.

Placeholder scan:

- No TBD, TODO, or omitted task sections.

Type consistency:

- Component names match the approved spec and task file paths.
