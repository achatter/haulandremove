# Requirements of a Directory Website for finding Hauling and Removal Services
A website for consumers to search for Hauling and Removal Services in their locality.

## Overview
This application is a full-stack web application that enables users to search for Hauling and Removal Services with city, state or zip-code information

The application will focus first on the sub categories of Estate Cleanout Services and Junk Removal

## 2nd Phase
Currently a subset of data related to Junk Removal and Junk Hauling has been scraped from Google Maps using the Outscraper tool.
In this phase, using this data subset, retrieve more data from each of the websites in the sheet. Data such as photos, specific services the company provides and other relevant information that would be useful to a consumer searching for Junk Hauling services.
To achieve this, code will have to iterate over each row in the CSV file, pull related content such as:
1) 2-3 photos
2) List of services, with details of each service if available
3) Service availablity in terms of days of the week and times of the day
4) Link to booking appointments if any

For each of the elements listed above, for each company, insert the data (image, services details etc.) into the Supabase database that has already been created.
Check if the Supabase DB has the correct schema to store this data. If not, clear out any data already in the tables, update the schema and edit, add or remove tables as needed in the Supabase database.

## Order of operations
1. ✅ Check the haulingandremoval DB to see if the schema can accommodate Pictures, List of services, Details of those services, link to booking appointments.
   - Current schema has `businesses`, `business_images`, and `reviews` tables
   - Missing: `services`, `service_availability`, and `booking_links` tables
2. ✅ Excel data file uploaded: `Junk_Removal_Cleaned_Small.xlsx` / `Junk_Removal_Cleaned_Small.csv`
3. ✅ Real data migration scripts created (import from Excel → Supabase)
4. ✅ `BusinessAttributes` component created — renders JSON attribute data (e.g. from Google Business Profile) as formatted UI with categorized sections; falls back to plain text
5. ⬜ Update the DB schema to add tables for: services (with details), service availability (days/hours), and booking appointment links. Delete existing data first if schema changes require it.
6. ⬜ Loop through each row in `Junk_Removal_Cleaned_Small.csv`, scrape each company's website using Crawl4AI for: 2-3 photos, list of services with details, service availability (days/hours), and booking links.
7. ⬜ For each row, store scraped elements into the new/updated tables in Supabase.
8. ⬜ Create/update test harnesses to verify the main listing page and a single company detail page can correctly display all scraped elements (photos, services, availability, booking link).

## Critical Files
| File | Purpose |
|------|---------|
| `supabase/schema.sql` | DB schema — businesses, business_images, reviews tables with RLS and triggers |
| `Junk_Removal_Cleaned_Small.xlsx` / `.csv` | Source data — junk removal companies scraped from Google Maps via Outscraper |
| `src/lib/seed/import-real-data.ts` | Imports business records from Excel into Supabase |
| `src/lib/seed/migrate-real-data.ts` | Full migration: cleans existing data then imports from Excel |
| `src/lib/seed/cleanup.ts` | Deletes all business/image/review data from Supabase |
| `src/lib/seed/data.ts` | Test seed data (50 businesses, ~150 images, ~200 reviews) |
| `src/lib/db/businesses.ts` | DB queries — searchBusinesses, getBusinessBySlug, getFeaturedBusinesses |
| `src/lib/db/reviews.ts` | DB queries — getReviewsForBusiness, insertReview, validateReview |
| `src/components/listings/BusinessAttributes.tsx` | Renders JSON attribute data as formatted UI (services, hours, etc.) |
| `src/components/listings/ListingDetail.tsx` | Business detail page component |
| `src/components/listings/ListingCard.tsx` | Card component used in search results and category pages |
| `src/app/listings/[slug]/page.tsx` | Business detail route |
| `src/app/search/` | Search page and results |
| `src/types/index.ts` | All shared TypeScript types |
| `DATA_MIGRATION.md` | Guide for running migration scripts |

## 3rd Phase
1. The current search results show up with the first 10-12 services based on the search. The dashboard shows a thumbnail image/logo of the company, the name of the company, their rating, location and phone number. In this phase that dashboard view needs to be improved to show some more information about the business - what are their exact services, their hours, possibly their rates. To show this, possibly shrink the thumbnail image/logo further so that each service doesn't take up more space. 
2. Upon clicking a specific service, it seems the content generated is generic. That content needs to be updated to reflect the real content from the company's website if they have any. If not, don't fabricate their services.
3. For the ratings, if it is clicked, and there are real ratings, open up a scrollable pop up that shows the ratings details - who rated them (alias is ok), what was the comment if any and their specific rating.
4. On the results page, if the type of service is changed via the drop down, immediately return the search results instead of having to hit the Search button again.