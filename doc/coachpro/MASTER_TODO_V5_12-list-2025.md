# CoachPro - Complete Task List

**Verze:** V4
**Aktualizováno:** Session #15 (11.11.2025)
**Status:** Universal Profile Management Complete

---

## ✅ Completed (Session #15)

### Universal Profile Management
- [x] Create ProfileScreen.jsx (100% modular, no userType conditions)
- [x] Add all profile fields (professional, social media, client-specific)
- [x] Create validation.js utils (email, phone, URLs)
- [x] Implement real-time validation with auto-formatting
- [x] Add password change UI
- [x] Fix Google photo display (CORS referrerPolicy)
- [x] Add autocomplete attributes for accessibility
- [x] Implement dual-table save (coaches + testers)
- [x] Fix ProfilePage to load from coachpro_coaches
- [x] Add database migrations (photo_url, professional fields, UNIQUE constraint)

### Documentation
- [x] Create session_15_summary.md
- [x] Update CLAUDE.md with Session #15 changes
- [x] Update MASTER_TODO_V4.md
- [x] Update MASTER_TODO_priority.md

---

## ✅ Completed (Session #14)

### Authentication & Authorization
- [x] Remove access code system (300+ lines removed)
- [x] Implement email + password authentication
- [x] Implement Google OAuth authentication
- [x] Implement Magic Link (OTP) authentication
- [x] Add email confirmation requirement
- [x] Fix RLS policies for testers table
- [x] Ensure auth_user_id always populated
- [x] Create CoachLogin.jsx (3 auth methods)

### Modular Architecture
- [x] Create universal RegisterForm component
- [x] Create universal WelcomeScreen component
- [x] Refactor TesterWelcome to use WelcomeScreen (-34% lines)
- [x] Refactor ClientWelcome to use WelcomeScreen (-41% lines)
- [x] Add "Rozcestník" to FloatingMenu for testers
- [x] Add clickable avatar with profile navigation

### Code Cleanup
- [x] Remove debug logs from RegisterForm
- [x] Remove debug logs from Tester.jsx
- [x] Remove debug logs from CoachLogin.jsx
- [x] Remove debug logs from ClientMaterials.jsx
- [x] Remove debug logs from ClientProfile.jsx
- [x] Remove debug logs from NotificationContext.jsx
- [x] Delete unused migration files (VARIANTA A)
- [x] Delete obsolete profile components (TesterProfile.jsx, TesterProfileTest.jsx)

### Documentation
- [x] Create summary14.md (comprehensive session docs)
- [x] Create/update CLAUDE.md with Session #14 changes
- [x] Create CLAUDE_QUICK_V1.md (quick reference)
- [x] Create CONTEXT_QUICK.md (architecture overview)
- [x] Create MASTER_TODO_priority.md
- [x] Create MASTER_TODO_V4.md (this file)

---

## 🚧 In Progress

_Nothing currently in progress_

---

## 📋 Planned - Components & UI

### Form Components (P2 - MEDIUM)
- [ ] PasswordReset.jsx component
- [ ] PasswordResetConfirm.jsx component

### Loading & Error (P4 - LOW)
- [ ] Universal LoadingSpinner component
- [ ] Universal ErrorBoundary component
- [ ] Universal EmptyState component

---

## 📋 Planned - Features

### Authentication & Security (P2 - MEDIUM)
- [ ] Password reset flow
  - Email form
  - Reset email sending
  - New password form
  - Password update
- [ ] Session timeout handling
  - Auth state listener
  - Automatic logout on expiry
  - Session refresh logic
- [ ] Rate limiting
  - Registration rate limit
  - Login attempt limit
  - Email send limit

### Session Management (P3 - MEDIUM)
- [ ] Coach sessions calendar view
- [ ] Create session from coach side
- [ ] Edit session from coach side
- [ ] Cancel session with notification
- [ ] Session reminders (email/push)
- [ ] Reschedule session functionality

### Client Features (P3 - MEDIUM)
- [ ] Program progress tracking
- [ ] Progress bars for programs
- [ ] Content unlock based on progress
- [ ] Homework submission
- [ ] Session feedback form

### Coach Features (P3 - LOW)
- [ ] Client management dashboard
- [ ] Bulk session creation
- [ ] Session templates
- [ ] Client notes with privacy
- [ ] Export client data

### Material Management (P3 - LOW)
- [ ] Material view analytics
- [ ] Material download tracking
- [ ] Material categories
- [ ] Material search
- [ ] Material favorites

---

## 📋 Planned - Database & Backend

### Database Schema (P2 - MEDIUM)
- [ ] Add session_reminders table
- [ ] Add client_progress table
- [ ] Add material_analytics table
- [ ] Add notification_preferences table

### RLS Policies (P5 - HIGH)
- [ ] Regular Security Advisor checks
- [ ] Test all user type permissions
- [ ] Document RLS patterns
- [ ] Add RLS policy tests

### Migrations (P2 - MEDIUM)
- [ ] Add indexes for performance
- [ ] Add database functions for complex queries
- [ ] Add triggers for auto-updates

---

## 📋 Planned - Testing & Quality

### Testing (P4 - HIGH)
- [ ] Email confirmation flow end-to-end test
- [ ] Tester registration → login → dashboard test
- [ ] Client registration → login → dashboard test
- [ ] Coach profile photo upload test
- [ ] Session creation → display → completion test

### Code Quality (P4 - MEDIUM)
- [ ] ESLint configuration
- [ ] Prettier configuration
- [ ] Pre-commit hooks
- [ ] TypeScript migration (optional)

### Performance (P7 - LOW)
- [ ] Route-based code splitting
- [ ] Component lazy loading
- [ ] Image lazy loading
- [ ] Progressive image loading
- [ ] Bundle size optimization
- [ ] Lighthouse performance audit

---

## 📋 Planned - UI/UX

### Responsive Design (P6 - HIGH)
- [ ] Test all pages on mobile devices
- [ ] Fix mobile responsive issues
- [ ] Add mobile-specific navigation
- [ ] Touch-friendly controls

### Accessibility (P6 - MEDIUM)
- [ ] Add ARIA labels to all interactive elements
- [ ] Keyboard navigation support
- [ ] Screen reader support
- [ ] Color contrast audit (WCAG AA)
- [ ] Focus indicators
- [ ] Skip to content link

### Animations & Interactions (P6 - LOW)
- [ ] Loading skeletons
- [ ] Page transitions
- [ ] Micro-interactions
- [ ] Toast notifications enhancement

---

## 📋 Planned - DevOps & Deployment

### Build & Deploy (P3 - LOW)
- [ ] Production build optimization
- [ ] Environment variables setup
- [ ] Staging environment
- [ ] CI/CD pipeline
- [ ] Error tracking (Sentry)
- [ ] Analytics (Plausible/GA)

### Monitoring (P3 - LOW)
- [ ] Application monitoring
- [ ] Error logging
- [ ] Performance monitoring
- [ ] User analytics

---

## 📋 Future Enhancements

### Advanced Features (P3 - VERY LOW)
- [ ] Video call integration (Zoom/Meet)
- [ ] Chat functionality
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Subscription management

### Coach Platform Features
- [ ] Coach marketplace
- [ ] Public coach profiles
- [ ] Client testimonials
- [ ] Coach certifications
- [ ] Booking system for new clients

---

## 🗑️ Deprecated / Removed

### Session #14 Removals
- ~~Access code system~~
- ~~testers.access_code column~~
- ~~testers.password_hash column~~
- ~~Access code generation logic~~
- ~~Access code validation~~
- ~~TesterProfile.jsx (old version)~~
- ~~TesterProfileTest.jsx~~
- ~~Unused migration files~~

---

## 📊 Progress Summary

### By Priority

| Priority | Total | Completed | In Progress | Planned |
|----------|-------|-----------|-------------|---------|
| P1 | 6 | 0 | 1 | 5 |
| P2 | 12 | 0 | 0 | 12 |
| P3 | 15 | 0 | 0 | 15 |
| P4 | 8 | 6 | 1 | 1 |
| P5 | 3 | 1 | 1 | 1 |
| P6 | 9 | 0 | 0 | 9 |
| P7 | 6 | 1 | 1 | 4 |

### By Category

| Category | Total | Completed | In Progress | Planned |
|----------|-------|-----------|-------------|---------|
| Authentication | 12 | 8 | 0 | 4 |
| Components | 15 | 2 | 1 | 12 |
| Features | 25 | 0 | 0 | 25 |
| Database | 8 | 2 | 1 | 5 |
| Testing | 10 | 6 | 1 | 3 |
| UI/UX | 12 | 1 | 0 | 11 |
| DevOps | 8 | 0 | 0 | 8 |
| Future | 10 | 0 | 0 | 10 |

### Overall Progress
- **Completed:** 19 tasks
- **In Progress:** 4 tasks
- **Planned:** 78 tasks
- **Total:** 101 tasks
- **Completion Rate:** 18.8%

---

## 🎯 Session Goals

### Session #15 Goals (Next)
1. Create ProfileScreen.jsx
2. Refactor ProfilePage.jsx with PhotoUpload
3. Test coach profile photo upload
4. Add autocomplete to password fields
5. Test email confirmation flow

### Session #16 Goals (Future)
1. Password reset functionality
2. Session timeout handling
3. Coach sessions management page
4. Mobile responsiveness fixes

---

## 📝 Notes

- Session #14 was major milestone - auth system completely overhauled
- Focus shifting to profile modularity and UX improvements
- 300+ lines removed, better architecture implemented
- All future auth uses email+password + OAuth, NO access codes

---

## 🔗 Related Documentation

- `CLAUDE.md` - Complete project instructions
- `CLAUDE_QUICK_V1.md` - Quick reference guide
- `CONTEXT_QUICK.md` - Architecture overview
- `MASTER_TODO_priority.md` - Priority-sorted tasks
- `docs/summary14.md` - Session #14 complete documentation

---

**Task List Motto:** Modularita, bezpečnost, uživatelský zážitek!
