# Database Schema Files

This directory contains all SQL schema files needed to set up a new Supabase project for the Rental Application System.

## 📁 Files Overview

### **complete-database-setup.sql** 
**All-in-one setup file** - Run this to set up everything at once.

Contains:
- Tables creation
- Indexes
- Functions & Triggers
- RLS policies
- Storage buckets
- Storage policies

**How to use:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy entire contents of this file
3. Paste and run
4. Done! ✅

---

### Individual Files (Optional)

If you prefer to run setup in stages:

**01-tables.sql**
- Creates `applications` and `payment_events` tables
- Creates all indexes

**02-storage.sql**
- Creates storage buckets (`ids`, `faces`)
- Sets up storage policies

**03-rls-policies.sql**
- Enables Row Level Security
- Creates RLS policies for tables

**04-functions-triggers.sql**
- Creates `update_updated_at_column()` function
- Sets up trigger for auto-updating timestamps

---

## 🚀 Quick Start

**Easiest Method:**
```sql
-- Just run this one file in SQL Editor:
schema/complete-database-setup.sql
```

**Staged Method:**
```sql
-- Run files in order:
1. schema/01-tables.sql
2. schema/02-storage.sql
3. schema/03-rls-policies.sql
4. schema/04-functions-triggers.sql
```

---

## 📊 Database Structure

### **Applications Table**
Stores rental application data with:
- Personal information (name, email, phone, address, DOB)
- Application details (applicants, pets, move-in date)
- Financial data (SSN last 4, income, deposit)
- Property information
- BTCPay payment tracking
- Document URLs (ID, face images)
- Face recognition data (for future ML)

### **Payment Events Table**
Audit log for payment webhook events:
- Linked to applications
- Tracks BTCPay invoice events
- Raw payload storage
- Processing status

### **Storage Buckets**
- **ids**: Government ID uploads (5MB limit, JPEG/PNG)
- **faces**: Face verification images (6MB limit, JPEG/PNG)

---

## 🔒 Security

All tables use Row Level Security (RLS):
- Only service role has access by default
- Protects sensitive applicant data
- Storage is private (not publicly accessible)

---

## ✅ Verification

After running setup, verify in Supabase Dashboard:

1. **Tables**: Go to Table Editor
   - ✅ `applications` table exists
   - ✅ `payment_events` table exists

2. **Storage**: Go to Storage
   - ✅ `ids` bucket exists
   - ✅ `faces` bucket exists

3. **Functions**: Go to Database → Functions
   - ✅ `update_updated_at_column` exists

---

## 🔄 Re-running Setup

All schema files use `IF NOT EXISTS` and `ON CONFLICT` clauses, so they're safe to re-run without errors.

---

## 📝 Notes

- Schema files are idempotent (safe to run multiple times)
- Storage policies may need to be dropped and recreated if changed
- Functions use `CREATE OR REPLACE` for easy updates
