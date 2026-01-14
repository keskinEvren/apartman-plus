# 🧪 ASANMOD ULTIMATE E2E TEST SCENARIO

> **Amaç**: Template'in gerçekten %100 çalıştığını kanıtlamak - pre-commit, tools, 0-0-0 policy vb.

---

## 📋 AGENT'A VERİLECEK GÖREV

```
PROJE: Simple Todo API with Authentication

ÖZELLİKLER:
1. User Management
   - POST /api/auth/register (email, password)
   - POST /api/auth/login (returns JWT)
   - GET /api/auth/me (current user info)

2. Todo Management (Authentication Required)
   - GET /api/todos (kullanıcının kendi todo'ları)
   - POST /api/todos (yeni todo oluştur)
   - PUT /api/todos/:id (todo güncelle)
   - DELETE /api/todos/:id (todo sil)

3. Database Schema
   - users table (id, email, password_hash, created_at)
   - todos table (id, user_id, title, completed, created_at)

4. Gereksinimler
   - PostgreSQL + Drizzle ORM
   - tRPC API
   - JWT authentication
   - Backend tests yazılmalı
   - ASANMOD commit format uygulanmalı
```

---

## ✅ BAŞARI KRİTERLERİ (Test Checklist)

### 1. Code Quality (0-0-0 Policy)
```bash
npm run verify
# Expected:
# [1/6] Environment... ✅
# [2/6] ESLint... ✅ (0 errors, 0 warnings)
# [3/6] TypeScript... ✅ (0 errors)
# [4/6] Tests... ✅ (all passing)
# [5/6] Security Audit... ⚠️ (non-blocking)
# [6/6] Build... ✅
```

### 2. Pre-Commit Hooks
```bash
# Test: Try to commit with console.log
echo "console.log('test');" >> src/server/index.ts
git add .
git commit -m "test: should be rejected"
# Expected: ❌ REJECTED by pre-commit hook

# Test: Try to commit with wrong format
git commit -m "wrong format commit"
# Expected: ❌ REJECTED by commit-msg hook

# Test: Valid commit
git commit -m "feat(api): add todo endpoints"
# Expected: ✅ ACCEPTED
```

### 3. API Endpoints (All 200 OK)
```bash
# Start server
npm run dev &
sleep 5

# Test 1: Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' \
  -w "\nStatus: %{http_code}\n"
# Expected: Status: 200

# Test 2: Login
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' \
  -s | jq -r '.token')
echo "Token: $TOKEN"
# Expected: JWT token received

# Test 3: Get todos (should be empty)
curl http://localhost:3001/api/todos \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nStatus: %{http_code}\n"
# Expected: Status: 200, []

# Test 4: Create todo
curl -X POST http://localhost:3001/api/todos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo"}' \
  -w "\nStatus: %{http_code}\n"
# Expected: Status: 200

# Test 5: Get todos (should have 1 item)
curl http://localhost:3001/api/todos \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nStatus: %{http_code}\n"
# Expected: Status: 200, [{"id":1,"title":"Test Todo","completed":false}]

# Cleanup
pkill -f "node.*3001"
```

### 4. Database Integrity
```bash
npm run db:push
# Expected: ✅ Schema pushed successfully

# Check tables exist
psql -d <DB_NAME> -c "\dt"
# Expected: users, todos tables present

# Check migrations
ls drizzle/
# Expected: Migration files present
```

### 5. Build & Production
```bash
npm run build
# Expected: ✅ Build successful, no errors

# Check build output
ls .next/
# Expected: Production build artifacts present

# Test production server
NODE_ENV=production npm start &
sleep 5
curl http://localhost:3002 -w "\nStatus: %{http_code}\n"
# Expected: Status: 200
pkill -f "node.*3002"
```

### 6. Git Compliance
```bash
# Check all files committed
git status
# Expected: "working tree clean"

# Check commit format
git log --oneline -5
# Expected: All commits follow "type(scope): message" format
# Examples:
# - feat(auth): add register endpoint
# - feat(todos): add CRUD operations
# - test(api): add endpoint tests
# - docs(readme): update setup instructions

# Check no forbidden patterns
grep -r "console.log" src/server/
# Expected: No results (backend has no console.log)

grep -r "any" src/ --include="*.ts" --exclude="*.d.ts"
# Expected: Minimal or zero usage of 'any' type
```

---

## 🤖 AGENT PROMPT (Copy-Paste)

```
TASK: Build a Simple Todo API with Authentication using ASANMOD template

REQUIREMENTS:
1. Clone template from: https://github.com/masan3134/asanmod-enterprise.git
2. Run wizard (npm run wizard)
3. Implement these endpoints:
   - POST /api/auth/register
   - POST /api/auth/login
   - GET /api/auth/me
   - GET /api/todos
   - POST /api/todos
   - PUT /api/todos/:id
   - DELETE /api/todos/:id

4. Database schema:
   - users (id, email, password_hash, created_at)
   - todos (id, user_id, title, completed, created_at)

5. STRICT RULES:
   - Use tRPC for all endpoints
   - Use Drizzle ORM for database
   - Write tests for all endpoints
   - Follow ASANMOD commit format: "type(scope): message"
   - No console.log in backend
   - Must pass: npm run verify (0 errors, 0 warnings)

6. VERIFICATION:
   - All endpoints tested with curl (200 OK)
   - All commits properly formatted
   - Working tree clean (git status)
   - Production build successful

SUCCESS CRITERIA:
✅ npm run verify - ALL GREEN
✅ All API endpoints return 200 OK
✅ Git commits follow ASANMOD format
✅ Pre-commit hooks active and blocking bad commits
✅ Production build works
```

---

## 📊 VERIFICATION SCRIPT (Automated)

```bash
#!/bin/bash
# ASANMOD Ultimate Test - Automated Verification

echo "🧪 ASANMOD ULTIMATE TEST"
echo "========================"

PASS=0
FAIL=0

check() {
    if eval "$2"; then
        echo "✅ $1"
        PASS=$((PASS + 1))
    else
        echo "❌ $1"
        FAIL=$((FAIL + 1))
    fi
}

# 1. Code Quality
echo "📋 Phase 1: Code Quality"
check "npm run verify passes" "npm run verify > /dev/null 2>&1"

# 2. Git Status
echo "📋 Phase 2: Git Compliance"
check "Working tree clean" "[[ \$(git status --porcelain) == '' ]]"
check "Commits follow format" "git log --oneline -5 | grep -qE '^[a-f0-9]+ (feat|fix|docs|test|chore)\\('"
check "No console.log in backend" "! grep -r 'console.log' src/server/"

# 3. Database
echo "📋 Phase 3: Database"
check "Database connection" "npm run db:push > /dev/null 2>&1"

# 4. Server
echo "📋 Phase 4: Server & API"
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 10

check "Dev server running" "curl -f http://localhost:3001/api/health > /dev/null 2>&1"
check "Register endpoint 200" "curl -X POST http://localhost:3001/api/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@test.com\",\"password\":\"pass123\"}' -w '%{http_code}' -o /dev/null -s | grep -q 200"

kill $SERVER_PID

# 5. Build
echo "📋 Phase 5: Production Build"
check "Build successful" "npm run build > /dev/null 2>&1"

echo ""
echo "========================"
echo "RESULTS: $PASS passed, $FAIL failed"

if [ $FAIL -eq 0 ]; then
    echo "🏆 PLATINUM CERTIFIED - Template is 100% functional!"
    exit 0
else
    echo "⚠️ Issues found - Template needs fixes"
    exit 1
fi
```

---

## 🎯 EXPECTED TIMELINE

**Agent Execution Time:**
- Clone + Setup: 2 min
- Implement auth: 10 min
- Implement todos: 10 min
- Write tests: 5 min
- Fix lints/errors: 5 min
- Commits: 2 min
**TOTAL: ~35 minutes** (vs human: 2-3 hours)

---

## 📝 DELIVERABLE CHECKLIST

**Agent must deliver:**
- [ ] All code committed (git status clean)
- [ ] All commits follow ASANMOD format
- [ ] npm run verify - 6/6 GREEN
- [ ] All endpoints curl tested (200 OK)
- [ ] Tests written and passing
- [ ] Production build works
- [ ] Pre-commit hooks blocking bad code
- [ ] No console.log in backend
- [ ] Database schema correct

**If all ✅**: **ASANMOD TEMPLATE PLATINUM CERTIFIED** 🏆

---

**AUTHOR**: ASANMOD QA Team
**DATE**: 2026-01-14
**PURPOSE**: Ultimate proof that template delivers on "0-0-0" promise
