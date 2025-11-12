# CoachPro - Priority Tasks

**Aktualizováno:** Session #15 (11.11.2025)

---

## ✅ Completed in Session #15

### ✅ 1.1 ProfileScreen Component
**Status:** ✅ COMPLETED
**Impact:** HIGH

**Achieved:**
- Created universal ProfileScreen.jsx (800 lines, 100% modular)
- Added ALL profile fields (professional, social media, client-specific)
- Implemented validation.js utils (email, phone, URLs)
- Real-time validation + auto-formatting
- Password change UI
- Google photo fallback (referrerPolicy fix)
- Accessibility (autocomplete attributes)
- Dual-table save (coaches + testers)
- Database migrations (photo_url, professional fields, UNIQUE constraint)

**Files Refactored:**
1. ✅ `ProfilePage.jsx` - Now uses ProfileScreen, loads from coachpro_coaches
2. ⏳ `TesterProfileSimple.jsx` - Future refactor
3. ⏳ `ClientProfile.jsx` - Future refactor (pattern established)

**Actual Impact:**
- Lines created: 800 (ProfileScreen) + 130 (validation.js)
- Modular design: 100% reusable
- PhotoUpload: Integrated with validation
- Database migrations: 3 new files

---

### ✅ 1.2 Autocomplete Attributes
**Status:** ✅ COMPLETED (Profile fields)
**Impact:** LOW

**Completed:**
- Added autocomplete to ProfileScreen fields (name, email, tel)
- Accessibility improved

**Still TODO:**
- RegisterForm.jsx password fields
- CoachLogin.jsx password fields

---

## 🔥 Priority 1 - KRITICKÉ (Next Session)

_Nothing critical - Profile Management complete!_

---

## ⚠️ Priority 2 - DŮLEŽITÉ (Soon)

### 2.1 Email Confirmation Flow Testing
**Status:** 🚧 Not tested end-to-end
**Urgency:** HIGH
**Impact:** MEDIUM

**Tasks:**
- [ ] Test tester registration → email → confirmation → login
- [ ] Test client registration → email → confirmation → login
- [ ] Test email не пришел → resend logic
- [ ] Test expired confirmation link
- [ ] Verify RLS works after confirmation

---

### 2.2 Password Reset Functionality
**Status:** ❌ Missing
**Urgency:** MEDIUM
**Impact:** MEDIUM

**Problem:**
No way for users to reset forgotten password

**Solution:**
Create `PasswordReset.jsx` page with:
1. Email input form
2. `supabase.auth.resetPasswordForEmail()`
3. Reset link email
4. New password form
5. Update password via Supabase Auth

**Files to Create:**
- `src/modules/coach/pages/PasswordReset.jsx`
- Add route to `App.jsx`

---

### 2.3 Session Timeout Handling
**Status:** ❌ Missing
**Urgency:** MEDIUM
**Impact:** HIGH

**Problem:**
No handling when user's session expires

**Solution:**
Add to TesterAuthContext + ClientAuthContext:
```javascript
useEffect(() => {
  const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      // Handle session expiry
    }
  });
  return () => authListener?.subscription?.unsubscribe();
}, []);
```

---

## 📋 Priority 3 - VYLEPŠENÍ (Later)

### 3.1 Coach Sessions Management
**Status:** 🚧 Partial (SessionCard exists)
**Urgency:** LOW
**Impact:** HIGH

**Tasks:**
- [ ] Coach sessions calendar view
- [ ] Create/edit/cancel sessions from coach side
- [ ] Send notifications to clients
- [ ] Session notes management

**Files to Create:**
- `src/modules/coach/pages/CoachSessions.jsx`
- Use existing `sessions.js` utils

---

### 3.2 Material Sharing Analytics
**Status:** ❌ Missing
**Urgency:** LOW
**Impact:** LOW

**Tasks:**
- [ ] Track material views
- [ ] Track material downloads
- [ ] Show analytics to coaches

---

### 3.3 Client Program Progress
**Status:** 🚧 Partial
**Urgency:** LOW
**Impact:** MEDIUM

**Tasks:**
- [ ] Track program completion
- [ ] Show progress bars
- [ ] Unlock content based on progress

---

## 🧪 Priority 4 - TESTING & QUALITY

### 4.1 Remove Debug Logs
**Status:** ✅ Completed Session #14
**Details:** All console.log removed from:
- RegisterForm.jsx
- Tester.jsx
- CoachLogin.jsx
- ClientMaterials.jsx
- ClientProfile.jsx
- NotificationContext.jsx

---

### 4.2 Error Boundary Component
**Status:** ❌ Missing
**Urgency:** LOW
**Impact:** MEDIUM

**Solution:**
Create universal ErrorBoundary component for graceful error handling

---

### 4.3 Loading States Consistency
**Status:** 🚧 Partial
**Urgency:** LOW
**Impact:** LOW

**Problem:**
Loading states vary across components

**Solution:**
Create universal LoadingSpinner component

---

## 🔐 Priority 5 - SECURITY & RLS

### 5.1 Security Advisor Check
**Status:** ⚠️ Needs regular checks
**Urgency:** HIGH
**Impact:** HIGH

**Tasks:**
- [ ] Check after every DB schema change
- [ ] Verify RLS policies correct
- [ ] Test permissions for all user types

---

### 5.2 Rate Limiting
**Status:** ❌ Missing
**Urgency:** LOW
**Impact:** MEDIUM

**Tasks:**
- [ ] Add rate limiting to registration
- [ ] Add rate limiting to login attempts
- [ ] Add rate limiting to email sends

---

## 📱 Priority 6 - UI/UX

### 6.1 Mobile Responsiveness
**Status:** 🚧 Partial
**Urgency:** MEDIUM
**Impact:** HIGH

**Tasks:**
- [ ] Test all pages on mobile
- [ ] Fix responsive issues
- [ ] Add mobile-specific navigation

---

### 6.2 Accessibility (a11y)
**Status:** 🚧 Partial
**Urgency:** LOW
**Impact:** MEDIUM

**Tasks:**
- [ ] Add ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast check

---

## 🚀 Priority 7 - PERFORMANCE

### 7.1 Image Optimization
**Status:** ✅ Partial (WebP compression exists)
**Urgency:** LOW
**Impact:** MEDIUM

**Tasks:**
- [ ] Lazy loading images
- [ ] Progressive image loading
- [ ] CDN integration

---

### 7.2 Code Splitting
**Status:** ❌ Missing
**Urgency:** LOW
**Impact:** MEDIUM

**Tasks:**
- [ ] Route-based code splitting
- [ ] Component lazy loading
- [ ] Bundle size optimization

---

## 📊 Completion Status

| Priority | Total Tasks | Completed | In Progress | Not Started |
|----------|-------------|-----------|-------------|-------------|
| P1 | 2 | 0 | 0 | 2 |
| P2 | 3 | 0 | 1 | 2 |
| P3 | 3 | 0 | 2 | 1 |
| P4 | 3 | 1 | 1 | 1 |
| P5 | 2 | 0 | 1 | 1 |
| P6 | 2 | 0 | 2 | 0 |
| P7 | 2 | 0 | 1 | 1 |
| **TOTAL** | **17** | **1** | **8** | **8** |

---

## 🎯 Next Session Goals

### Must Do
1. ✅ Create ProfileScreen.jsx
2. ✅ Refactor ProfilePage.jsx with ProfileScreen + PhotoUpload
3. ✅ Test profile photo upload for coaches

### Should Do
4. Add autocomplete attributes to password fields
5. Test email confirmation flow end-to-end

### Nice to Have
6. Start password reset functionality

---

## 📝 Notes

- Session #14 completed major auth refactoring
- Access code system completely removed
- WelcomeScreen and RegisterForm now universal
- Focus on profile modularity for Session #15

---

**Priority Motto:** Modularita first, features second!
