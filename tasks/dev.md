# Development Notes - NotesVault

## Code/Functions to Remove Before Production

### Placeholder Section
*This file will be updated as we identify development-only code that needs removal before production*

---

## Current Development Items:

### Fixed Issues:

1. **MongoDB Connection Error (500 on /api/register)**
   - **Issue 1**: Database URL was missing database name
   - **Fix 1**: Changed from `mongodb://localhost:27017/` to `mongodb://localhost:27017/quicknotes`
   
   - **Issue 2**: Prisma transactions require MongoDB replica set
   - **Error**: "Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set"
   - **Fix 2**: Removed `onDelete: Cascade` from Prisma schema (which triggers transactions)
   - **Note**: For production with MongoDB Atlas, replica sets are automatic
   - **Date**: October 17, 2025

### MongoDB Local Development Setup:

**Option A: Use without Replica Set (Current Solution)**
- Removed `onDelete: Cascade` from schema
- Works with standalone MongoDB
- Suitable for development

**Option B: Setup Replica Set (Production-like)**
If you want full transaction support locally:
```bash
# Stop MongoDB
mongod --shutdown

# Start as replica set
mongod --replSet rs0

# Initialize replica set (in mongo shell)
rs.initiate()
```

Then add back `onDelete: Cascade` in schema.

---

## Security Reminders:
- [ ] Remove all console.log statements with sensitive data
- [ ] Remove any test/demo user credentials
- [ ] Ensure no API keys or secrets in code
- [ ] Remove development-only API endpoints
- [ ] Check for commented-out debug code

---

*Last Updated: [Will be updated as we progress]*
