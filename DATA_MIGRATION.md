# Data Migration Guide

This document explains how to migrate from test data to real data using the provided scripts.

## Overview

The repository includes scripts to:
1. **Clean existing test data** from Supabase
2. **Import real business data** from Excel files
3. **Complete migration** in one command

## Prerequisites

1. **Environment Setup**: Ensure your `.env.local` file contains:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Dependencies**: Install required packages:
   ```bash
   npm install
   ```

3. **Excel File**: Prepare your Excel file with business data. The script supports various column name formats (see below).

## Quick Start

### Complete Migration (Recommended)

To replace all test data with real data in one command:

```bash
npm run migrate-data path/to/Junk_Removal_Cleaned_Small.xlsx
```

This command will:
1. Remove all existing test data
2. Import your real business data
3. Provide a summary of changes

### Individual Commands

If you prefer step-by-step control:

1. **Clean existing data only:**
   ```bash
   npm run cleanup
   ```

2. **Import data only** (without cleaning):
   ```bash
   npm run import-data path/to/your-file.xlsx
   ```

3. **Restore test data:**
   ```bash
   npm run seed
   ```

## Excel File Format

The import script is flexible and supports various column name formats. Here are the supported field mappings:

### Required Fields
- **Name**: `name`, `business_name`, `company_name`, `business`, `company`
- **City**: `city`, `location`, `town`
- **State**: `state`, `st`, `province` (accepts both abbreviations like "TX" and full names like "Texas")

### Optional Fields
- **Phone**: `phone`, `telephone`, `phone_number`, `tel`
- **Email**: `email`, `email_address`, `contact_email`
- **Website**: `website`, `url`, `web`, `site`
- **Address**: `address`, `street_address`, `street`, `addr`
- **Zip Code**: `zip`, `zip_code`, `zipcode`, `postal_code`, `postcode`
- **Description**: `description`, `about`, `details`, `services`
- **Years in Business**: `years_in_business`, `years`, `experience`, `years_experience`
- **Insurance**: `insured`, `insurance`, `is_insured` (accepts: yes/no, true/false, 1/0)
- **Bonded**: `bonded`, `bond`, `is_bonded` (accepts: yes/no, true/false, 1/0)

### Example Excel Structure

| name | city | state | phone | email | website | address | zip |
|------|------|-------|-------|-------|---------|---------|-----|
| ABC Junk Removal | Austin | TX | 5125551234 | info@abc.com | https://abc.com | 123 Main St | 78701 |

## Data Processing

The script automatically:
- **Generates slugs** from business name, city, and state
- **Normalizes phone numbers** (removes formatting, handles 10/11 digit numbers)
- **Standardizes states** (converts between abbreviations and full names)
- **Sets category** to 'junk_removal' (since file is for junk removal data)
- **Validates required fields** and skips invalid entries with warnings

## Database Schema

The data is imported into these Supabase tables:

### businesses
- `id` (UUID, auto-generated)
- `name` (required)
- `slug` (unique, auto-generated)
- `category` (set to 'junk_removal')
- `city`, `state`, `state_full` (required)
- `phone`, `email`, `website`, `street_address`, `zip_code` (optional)
- `description`, `years_in_business` (optional)
- `insured`, `bonded`, `featured` (boolean flags)
- `average_rating`, `review_count` (set to 0 initially)
- `status` (set to 'active')

### business_images
- Currently populated with placeholder data
- Can be enhanced to include real business photos

### reviews  
- Cleared during migration
- Can be populated separately if review data is available

## Error Handling

The scripts provide detailed logging:
- **✅ Success messages** for completed operations
- **⚠️ Warnings** for skipped entries with reasons
- **❌ Errors** for critical failures

Common warnings:
- Missing required fields (name, city, state)
- Invalid state names
- Malformed phone numbers

## Rollback

To restore the original test data after migration:

```bash
npm run seed
```

This will restore the original test dataset with businesses across multiple US cities.

## Troubleshooting

### "Excel file not found"
- Ensure the file path is correct
- Use absolute or relative paths from the project root
- Check file permissions

### "No valid businesses found"
- Verify your Excel file has the expected columns
- Check that required fields (name, city, state) are populated
- Review the console output for specific row warnings

### "Database connection error"
- Verify your `.env.local` file has correct Supabase credentials
- Ensure the service role key has appropriate permissions
- Check your network connection to Supabase

### "Permission denied"
- Ensure your Supabase service role key has admin permissions
- Check RLS policies if you've customized them

## Security Notes

- The service role key bypasses Row Level Security
- Only run these scripts in development/staging environments
- Keep your `.env.local` file secure and never commit it to version control

## Support

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify your Excel file format matches the expected structure
3. Ensure all environment variables are set correctly
4. Test with a small sample of data first