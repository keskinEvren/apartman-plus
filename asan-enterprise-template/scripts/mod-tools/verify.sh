#!/bin/bash
# ASANMOD v2.0.1: Code Quality Verification
# Runs: ESLint + TypeScript + Tests + Env Check + Build

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 ASANMOD Code Quality Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 1. Environment Check
echo -e "${YELLOW}[1/6]${NC} Checking environment..."
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

# Check required env vars
REQUIRED_VARS=("DATABASE_URL" "JWT_SECRET")
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env; then
        echo -e "${RED}❌ Required variable missing: $var${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✅ Environment validated${NC}"
echo ""

# 2. ESLint
echo -e "${YELLOW}[2/6]${NC} Running ESLint..."
if npm run lint; then
    echo -e "${GREEN}✅ ESLint passed${NC}"
else
    echo -e "${RED}❌ ESLint failed${NC}"
    exit 1
fi
echo ""

# 3. TypeScript
echo -e "${YELLOW}[3/6]${NC} Running TypeScript check..."
if npx tsc --noEmit; then
    echo -e "${GREEN}✅ TypeScript check passed${NC}"
else
    echo -e "${RED}❌ TypeScript errors found${NC}"
    exit 1
fi
echo ""

# 4. Tests
echo -e "${YELLOW}[4/6]${NC} Running tests..."
if npm test -- --passWithNoTests; then
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
fi
echo ""

# 5. Security Audit
echo -e "${YELLOW}[5/6]${NC} Running security audit..."
if npm audit --omit=dev --audit-level=high; then
    echo -e "${GREEN}✅ No high/critical vulnerabilities${NC}"
else
    echo -e "${YELLOW}⚠️  Vulnerabilities found (review recommended)${NC}"
fi
echo ""

# 6. Build Test
echo -e "${YELLOW}[6/6]${NC} Testing production build..."
if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All checks passed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
