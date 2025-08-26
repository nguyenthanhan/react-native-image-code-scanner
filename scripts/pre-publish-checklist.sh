#!/bin/bash

# Pre-publish checklist for react-native-image-code-scanner
echo "🚀 Pre-Publish Checklist for React Native Image Code Scanner"
echo "============================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_CHECKS_PASSED=true

# Function to check command status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ALL_CHECKS_PASSED=false
    fi
}

# 1. Check npm login
echo "📝 Checking npm authentication..."
npm whoami &> /dev/null
check_status $? "npm authentication (logged in as: $(npm whoami 2>/dev/null || echo 'not logged in'))"
echo ""

# 2. Run linting
echo "🧹 Running linting..."
npm run lint &> /dev/null
check_status $? "ESLint checks"
echo ""

# 3. Run type checking
echo "🔍 Running TypeScript type checking..."
npm run typecheck &> /dev/null
check_status $? "TypeScript type checking"
echo ""

# 4. Run build
echo "🔨 Building the package..."
npm run build &> /dev/null
check_status $? "Package build"
echo ""

# 5. Check package files
echo "📦 Validating package structure..."
node scripts/validate-package.js &> /dev/null
check_status $? "Package structure validation"
echo ""

# 6. Check version
echo "📌 Package version:"
VERSION=$(node -p "require('./package.json').version")
echo "   Current version: $VERSION"
echo ""

# 7. Check git status
echo "🗂️ Git status:"
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ Working directory clean${NC}"
else
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    git status --short
fi
echo ""

# 8. Check dependencies
echo "📚 Dependency check:"
npm ls &> /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ All dependencies resolved${NC}"
else
    echo -e "${YELLOW}⚠️  Some dependency issues detected (run 'npm ls' for details)${NC}"
fi
echo ""

# 9. Test package size
echo "📏 Package size check:"
SIZE=$(npm pack --dry-run 2>&1 | grep "package size:" | awk '{print $3, $4}')
echo "   Package size: $SIZE"
UNPACKED_SIZE=$(npm pack --dry-run 2>&1 | grep "unpacked size:" | awk '{print $3, $4}')
echo "   Unpacked size: $UNPACKED_SIZE"
echo ""

# 10. Check README exists and has content
echo "📖 Documentation check:"
if [ -f "README.md" ] && [ -s "README.md" ]; then
    echo -e "${GREEN}✅ README.md exists and has content${NC}"
else
    echo -e "${RED}❌ README.md is missing or empty${NC}"
    ALL_CHECKS_PASSED=false
fi

if [ -f "CHANGELOG.md" ] && [ -s "CHANGELOG.md" ]; then
    echo -e "${GREEN}✅ CHANGELOG.md exists and has content${NC}"
else
    echo -e "${YELLOW}⚠️  CHANGELOG.md is missing or empty${NC}"
fi
echo ""

# Final status
echo "============================================================"
if [ "$ALL_CHECKS_PASSED" = true ]; then
    echo -e "${GREEN}✅ All checks passed! Package is ready to publish.${NC}"
    echo ""
    echo "📦 To publish, run:"
    echo "   npm publish"
    echo ""
    echo "🏷️ To publish with a tag (e.g., beta):"
    echo "   npm publish --tag beta"
    echo ""
    echo "📝 Don't forget to:"
    echo "   1. Update CHANGELOG.md with release notes"
    echo "   2. Create a git tag: git tag v$VERSION"
    echo "   3. Push the tag: git push origin v$VERSION"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues before publishing.${NC}"
    exit 1
fi
