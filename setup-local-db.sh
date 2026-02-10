#!/bin/bash

echo "🚀 Setting up local development database..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo -e "${YELLOW}⚠️  MySQL is not running${NC}"
    echo "Starting MySQL..."
    brew services start mysql
    sleep 3
fi

# Database credentials
DB_NAME="kettekyu_local"
DB_USER="root"
DB_PASS="root"

echo -e "${GREEN}📦 Creating database...${NC}"

# Create database
mysql -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database '$DB_NAME' created${NC}"
else
    echo -e "${RED}❌ Failed to create database. Please check MySQL credentials${NC}"
    echo "Try running: mysql -u root -p"
    exit 1
fi

echo ""
echo -e "${GREEN}🔧 Updating .env file...${NC}"

# Backup existing .env
cp .env .env.backup

# Update .env
cat > .env << EOF
# Local MySQL Database
DATABASE_URL="mysql://$DB_USER:$DB_PASS@localhost:3306/$DB_NAME"

# Auth Secret
AUTH_SECRET="local-dev-secret-key-change-me"

# Base URL for local development
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
EOF

echo -e "${GREEN}✅ .env updated (backup saved as .env.backup)${NC}"

echo ""
echo -e "${GREEN}📊 Running Prisma migrations...${NC}"

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push --accept-data-loss

echo ""
echo -e "${GREEN}🌱 Seeding database...${NC}"

# Seed database
npx prisma db seed

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📝 You can now login with:"
echo "   Admin: admin@admin.com / admin123"
echo "   Test Admin: sinalhuon@gmail.com / admin123"
echo "   Client: client@test.com / client123"
echo ""
echo "🚀 Start development server:"
echo "   npm run dev"
echo ""
echo "🔍 View database:"
echo "   npx prisma studio"
