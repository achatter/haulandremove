"""
Hauling & Removal Services — Nationwide Lead Generation Pipeline
================================================================
Authors:  achatter + Claude (claude.ai)
Version:  2.1.0  (2026-04-11)
Actor:    compass/crawler-google-places (Apify Google Maps Scraper)

Version history:
  2.1.0  (2026-04-11)
    - Fixed image data gap: flatten_record() now captures up to MAX_IMAGES photo
      URLs per listing from the Apify "imageUrls" array field (confirmed field name
      from compass/crawler-google-places output schema). The top-level "imageUrl"
      thumbnail is also captured as a dedicated column. Three new CSV columns added:
      image_url_1, image_url_2, image_url_3. Applies to all --search terms and to
      the trial command identically — both call launch_one() which already sends
      maxImages: MAX_IMAGES to Apify.

  2.0.0  (2026-04-06)
    - Parameterized --search flag: any service category (junk hauling, estate
      cleanout, furniture removal, etc.) runs against the same 260-city footprint
    - Each search term gets its own isolated tracking file and output CSV
    - trial command: 5-city validation run across 5 states before full launch
    - kill command: immediately aborts all active Apify runs to stop costs
    - diagnose command: full per-city status and item count breakdown
    - Batched execution engine: submits 7 runs at a time (4,096 MB each) to stay
      within Apify Starter plan's 32,768 MB combined memory ceiling
    - Polling interval set to 50s with unbounded while loop — continues until
      all runs in a batch reach a terminal state, regardless of duration
    - Fixed item count reading: compass/crawler-google-places uses pay-per-event
      pricing where stats.itemCount always returns 0; counts now read directly
      from the dataset API (GET /v2/datasets/{datasetId})
    - harvest filters on status == SUCCEEDED (not cached item count) and writes
      real item counts back to run_tracking.json after each dataset fetch
    - Explicit TIER3_CODES set with 6 safety assertions at import time to catch
      any future tier misconfiguration before a single API call is made
    - Duplicate city name bug fixed: CITY_MAP keyed on (city, state_code) tuples
      so Columbus/OH vs GA, Springfield/IL vs MA vs MO etc. always resolve correctly
    - retry clears ABORTED, FAILED, TIMED-OUT, and SUCCEEDED-with-0-items runs;
      protects any SUCCEEDED run with items > 0
    - abort API endpoint verified from Apify docs:
      POST /v2/actor-runs/{runId}/abort

  1.0.0  (2026-03-15)
    - Initial release: single hardcoded search term ("junk hauling")
    - 260 cities across all 50 states in 3 tiers (Tier 1: 40, Tier 2: 108, Tier 3: 112)
    - Async launch with ThreadPoolExecutor, status polling, harvest to CSV
    - Contact enrichment via scrapeContacts flag (emails, social profiles)
    - Deduplication on (business_name, phone) across all city datasets

RECOMMENDED WORKFLOW:

  1. python junk_hauling_launcher.py launch     — submit all 260 city runs
  2. python junk_hauling_launcher.py status     — check progress (run after 30–60 min)
  3. python junk_hauling_launcher.py diagnose   — see per-city item counts; spot 0-item runs
  4. python junk_hauling_launcher.py retry      — re-submit ABORTED, FAILED, or 0-item runs
     (repeat steps 2–4 until diagnose shows 0 cities needing retry)
  5. python junk_hauling_launcher.py harvest    — merge all results into one CSV

Commands (all commands require --search):
  launch   — Submit city runs for a given search term:
               python junk_hauling_launcher.py launch --search "junk hauling"
               python junk_hauling_launcher.py launch --search "estate cleanout" tier1
               python junk_hauling_launcher.py launch --search "estate cleanout" tier2
               python junk_hauling_launcher.py launch --search "estate cleanout" tier3
             Optional tier filter (tier1/tier2/tier3) runs only that subset.
  status   — Refresh live status for a search:
               python junk_hauling_launcher.py status --search "junk hauling"
  diagnose — Full per-city breakdown for a search:
               python junk_hauling_launcher.py diagnose --search "junk hauling"
  retry    — Re-submit ABORTED/FAILED/0-item runs for a search:
               python junk_hauling_launcher.py retry --search "junk hauling"
  kill     — Abort all active runs for a search (type KILL to confirm):
               python junk_hauling_launcher.py kill --search "junk hauling"
  reset    — Delete the tracking file for a search (type YES to confirm):
               python junk_hauling_launcher.py reset --search "junk hauling"
  harvest  — Pull all SUCCEEDED datasets into a CSV for a search:
               python junk_hauling_launcher.py harvest --search "junk hauling"
  trial    — Run a quick 5-city validation across 5 states (one per tier) before
             committing to a full 260-city run. Uses a separate trial tracking file
             and CSV so it never touches your main run data:
               python junk_hauling_launcher.py trial --search "junk hauling"

Each search term gets its own tracking file and output CSV, so multiple
searches can run independently without interfering with each other.

Requires:
    pip install requests
    Set APIFY_TOKEN as an environment variable before running:
      export APIFY_TOKEN=apify_api_xxxxxxxxxxxxxxxxxxxx
    Or paste your token directly into the APIFY_TOKEN line below.
"""

import os
import sys
import json
import csv
import time
import requests
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

# ── CONFIG ────────────────────────────────────────────────────────────────────
APIFY_TOKEN          = os.environ.get("APIFY_TOKEN", "YOUR_APIFY_TOKEN_HERE")
ACTOR_ID             = "compass~crawler-google-places"
PLACES_LIMIT         = 50
SCRAPE_CONTACTS      = True
MAX_WORKERS          = 7      # Starter plan: 32,768 MB combined memory cap ÷ 4,096 MB per run = 8 max; using 7 for safety buffer
MEMORY_MB            = 4096   # 4 GB — prevents 0-item runs caused by memory exhaustion

# Detail page scraping — set True to capture opening hours, service options,
# popular times, Q&A, and additional attributes. Adds cost ($) per place.
SCRAPE_DETAIL_PAGE   = True

# Images — number of photos to fetch per listing (0 = none). Adds cost ($).
# A small number (3–5) is sufficient for directory thumbnail use.
MAX_IMAGES           = 3

# ── CATEGORY EXCLUSION FILTER ─────────────────────────────────────────────────
# Categories to exclude from harvest output. Applied after scraping so it costs
# nothing extra — irrelevant results are simply dropped before the CSV is written.
# Expand this list as needed for your niche.
EXCLUDE_CATEGORIES = {
    # Real estate
    "real estate agency", "real estate agent", "real estate consultant",
    "real estate attorney", "real estate appraiser", "estate agent",
    # Finance & legal
    "title company", "mortgage lender", "financial planner",
    "insurance agency", "accountant", "lawyer", "attorney",
    "personal injury lawyer", "legal services",
    # Appraisers & inspectors
    "appraiser", "home inspector",
}

def make_filenames(search_term):
    """Derive tracking file and CSV names from the search term.
    e.g. "junk hauling"     → run_tracking_junk_hauling.json, junk_hauling_all_cities.csv
         "estate cleanout"  → run_tracking_estate_cleanout.json, estate_cleanout_all_cities.csv
    """
    slug = search_term.lower().strip().replace(" ", "_").replace("/", "_")
    return f"run_tracking_{slug}.json", f"{slug}_all_cities.csv"

BASE_URL = f"https://api.apify.com/v2/acts/{ACTOR_ID}/runs"

# ── TIER DEFINITIONS ──────────────────────────────────────────────────────────
TIER1_CODES = {"CA", "TX", "FL", "NY"}

TIER2_CODES = {
    "PA", "IL", "OH", "GA", "NC", "WA", "AZ", "MI",
    "NJ", "CO", "VA", "TN", "IN", "MA", "MO", "MD", "WI", "MN",
}

TIER3_CODES = {
    "AK", "AL", "AR", "CT", "DE", "HI", "IA", "ID",
    "KS", "KY", "LA", "ME", "MS", "MT", "ND", "NE",
    "NH", "NM", "NV", "OK", "OR", "RI", "SC", "SD",
    "UT", "VT", "WV", "WY",
}

# Safety assertion — catches any future mismatch immediately at import time
assert len(TIER1_CODES) == 4,  f"Tier 1 should have 4 states, got {len(TIER1_CODES)}"
assert len(TIER2_CODES) == 18, f"Tier 2 should have 18 states, got {len(TIER2_CODES)}"
assert len(TIER3_CODES) == 28, f"Tier 3 should have 28 states, got {len(TIER3_CODES)}"
assert TIER1_CODES & TIER2_CODES == set(), "Overlap between Tier 1 and Tier 2"
assert TIER1_CODES & TIER3_CODES == set(), "Overlap between Tier 1 and Tier 3"
assert TIER2_CODES & TIER3_CODES == set(), "Overlap between Tier 2 and Tier 3"
assert len(TIER1_CODES | TIER2_CODES | TIER3_CODES) == 50, "Tiers don't cover all 50 states" 

# Statuses that indicate the run did not complete successfully
FAILED_STATUSES = {"FAILED", "ABORTED", "TIMED-OUT", "ABORTING", "TIMING-OUT"}

# A run needs retry if its status is failed OR if it succeeded but returned 0 items
def needs_retry(run):
    status = run.get("status", "")
    items  = run.get("items", 0)
    return status in FAILED_STATUSES or (status == "SUCCEEDED" and items == 0)

# A run is complete and has data — do not touch it
def has_data(run):
    return run.get("status") == "SUCCEEDED" and run.get("items", 0) > 0


# ── CITY MAP — (city, state_code) → state_name ───────────────────────────────
# Dict-keyed on (city, state_code) tuples so cities that share a name across
# states (Columbus OH/GA, Springfield IL/MO/MA, Aurora IL/CO, Arlington TX/VA,
# Rochester NY/MN, Portland ME/OR, Kansas City MO/KS, Fayetteville NC/AR,
# Newark NJ/DE, Charleston SC/WV, Columbia MO/SC, Bellevue WA/NE) always
# resolve to the correct state. Never use a list + next() for lookups.
CITY_MAP = {
    # Tier 1 — CA (10 cities)
    ("Los Angeles",      "CA"): "California",
    ("San Diego",        "CA"): "California",
    ("San Jose",         "CA"): "California",
    ("San Francisco",    "CA"): "California",
    ("Fresno",           "CA"): "California",
    ("Sacramento",       "CA"): "California",
    ("Long Beach",       "CA"): "California",
    ("Oakland",          "CA"): "California",
    ("Bakersfield",      "CA"): "California",
    ("Anaheim",          "CA"): "California",
    # Tier 1 — TX (10 cities)
    ("Houston",          "TX"): "Texas",
    ("San Antonio",      "TX"): "Texas",
    ("Dallas",           "TX"): "Texas",
    ("Austin",           "TX"): "Texas",
    ("Fort Worth",       "TX"): "Texas",
    ("El Paso",          "TX"): "Texas",
    ("Arlington",        "TX"): "Texas",
    ("Corpus Christi",   "TX"): "Texas",
    ("Plano",            "TX"): "Texas",
    ("Lubbock",          "TX"): "Texas",
    # Tier 1 — FL (10 cities)
    ("Jacksonville",     "FL"): "Florida",
    ("Miami",            "FL"): "Florida",
    ("Tampa",            "FL"): "Florida",
    ("Orlando",          "FL"): "Florida",
    ("St. Petersburg",   "FL"): "Florida",
    ("Hialeah",          "FL"): "Florida",
    ("Tallahassee",      "FL"): "Florida",
    ("Fort Lauderdale",  "FL"): "Florida",
    ("Port St. Lucie",   "FL"): "Florida",
    ("Cape Coral",       "FL"): "Florida",
    # Tier 1 — NY (10 cities)
    ("New York City",    "NY"): "New York",
    ("Buffalo",          "NY"): "New York",
    ("Rochester",        "NY"): "New York",
    ("Yonkers",          "NY"): "New York",
    ("Syracuse",         "NY"): "New York",
    ("Albany",           "NY"): "New York",
    ("New Rochelle",     "NY"): "New York",
    ("Mount Vernon",     "NY"): "New York",
    ("Schenectady",      "NY"): "New York",
    ("Utica",            "NY"): "New York",
    # Tier 2 — PA (6 cities)
    ("Philadelphia",     "PA"): "Pennsylvania",
    ("Pittsburgh",       "PA"): "Pennsylvania",
    ("Allentown",        "PA"): "Pennsylvania",
    ("Erie",             "PA"): "Pennsylvania",
    ("Reading",          "PA"): "Pennsylvania",
    ("Scranton",         "PA"): "Pennsylvania",
    # Tier 2 — IL
    ("Chicago",          "IL"): "Illinois",
    ("Aurora",           "IL"): "Illinois",
    ("Joliet",           "IL"): "Illinois",
    ("Rockford",         "IL"): "Illinois",
    ("Springfield",      "IL"): "Illinois",
    ("Peoria",           "IL"): "Illinois",
    # Tier 2 — OH
    ("Columbus",         "OH"): "Ohio",
    ("Cleveland",        "OH"): "Ohio",
    ("Cincinnati",       "OH"): "Ohio",
    ("Toledo",           "OH"): "Ohio",
    ("Akron",            "OH"): "Ohio",
    ("Dayton",           "OH"): "Ohio",
    # Tier 2 — GA
    ("Atlanta",          "GA"): "Georgia",
    ("Augusta",          "GA"): "Georgia",
    ("Columbus",         "GA"): "Georgia",
    ("Macon",            "GA"): "Georgia",
    ("Savannah",         "GA"): "Georgia",
    ("Athens",           "GA"): "Georgia",
    # Tier 2 — NC
    ("Charlotte",        "NC"): "North Carolina",
    ("Raleigh",          "NC"): "North Carolina",
    ("Greensboro",       "NC"): "North Carolina",
    ("Durham",           "NC"): "North Carolina",
    ("Winston-Salem",    "NC"): "North Carolina",
    ("Fayetteville",     "NC"): "North Carolina",
    # Tier 2 — WA
    ("Seattle",          "WA"): "Washington",
    ("Spokane",          "WA"): "Washington",
    ("Tacoma",           "WA"): "Washington",
    ("Vancouver",        "WA"): "Washington",
    ("Bellevue",         "WA"): "Washington",
    ("Kirkland",         "WA"): "Washington",
    # Tier 2 — AZ
    ("Phoenix",          "AZ"): "Arizona",
    ("Tucson",           "AZ"): "Arizona",
    ("Mesa",             "AZ"): "Arizona",
    ("Chandler",         "AZ"): "Arizona",
    ("Scottsdale",       "AZ"): "Arizona",
    ("Tempe",            "AZ"): "Arizona",
    # Tier 2 — MI
    ("Detroit",          "MI"): "Michigan",
    ("Grand Rapids",     "MI"): "Michigan",
    ("Warren",           "MI"): "Michigan",
    ("Sterling Heights", "MI"): "Michigan",
    ("Lansing",          "MI"): "Michigan",
    ("Ann Arbor",        "MI"): "Michigan",
    # Tier 2 — NJ
    ("Newark",           "NJ"): "New Jersey",
    ("Jersey City",      "NJ"): "New Jersey",
    ("Paterson",         "NJ"): "New Jersey",
    ("Elizabeth",        "NJ"): "New Jersey",
    ("Trenton",          "NJ"): "New Jersey",
    ("Camden",           "NJ"): "New Jersey",
    # Tier 2 — CO
    ("Denver",           "CO"): "Colorado",
    ("Colorado Springs", "CO"): "Colorado",
    ("Aurora",           "CO"): "Colorado",
    ("Fort Collins",     "CO"): "Colorado",
    ("Lakewood",         "CO"): "Colorado",
    ("Thornton",         "CO"): "Colorado",
    # Tier 2 — VA
    ("Virginia Beach",   "VA"): "Virginia",
    ("Norfolk",          "VA"): "Virginia",
    ("Chesapeake",       "VA"): "Virginia",
    ("Richmond",         "VA"): "Virginia",
    ("Newport News",     "VA"): "Virginia",
    ("Arlington",        "VA"): "Virginia",
    # Tier 2 — TN
    ("Nashville",        "TN"): "Tennessee",
    ("Memphis",          "TN"): "Tennessee",
    ("Knoxville",        "TN"): "Tennessee",
    ("Chattanooga",      "TN"): "Tennessee",
    ("Clarksville",      "TN"): "Tennessee",
    ("Murfreesboro",     "TN"): "Tennessee",
    # Tier 2 — IN
    ("Indianapolis",     "IN"): "Indiana",
    ("Fort Wayne",       "IN"): "Indiana",
    ("Evansville",       "IN"): "Indiana",
    ("South Bend",       "IN"): "Indiana",
    ("Carmel",           "IN"): "Indiana",
    ("Fishers",          "IN"): "Indiana",
    # Tier 2 — MA
    ("Boston",           "MA"): "Massachusetts",
    ("Worcester",        "MA"): "Massachusetts",
    ("Springfield",      "MA"): "Massachusetts",
    ("Lowell",           "MA"): "Massachusetts",
    ("Cambridge",        "MA"): "Massachusetts",
    ("New Bedford",      "MA"): "Massachusetts",
    # Tier 2 — MO
    ("Kansas City",      "MO"): "Missouri",
    ("St. Louis",        "MO"): "Missouri",
    ("Springfield",      "MO"): "Missouri",
    ("Columbia",         "MO"): "Missouri",
    ("Independence",     "MO"): "Missouri",
    ("Lee's Summit",     "MO"): "Missouri",
    # Tier 2 — MD
    ("Baltimore",        "MD"): "Maryland",
    ("Frederick",        "MD"): "Maryland",
    ("Rockville",        "MD"): "Maryland",
    ("Gaithersburg",     "MD"): "Maryland",
    ("Bowie",            "MD"): "Maryland",
    ("Hagerstown",       "MD"): "Maryland",
    # Tier 2 — WI
    ("Milwaukee",        "WI"): "Wisconsin",
    ("Madison",          "WI"): "Wisconsin",
    ("Green Bay",        "WI"): "Wisconsin",
    ("Kenosha",          "WI"): "Wisconsin",
    ("Racine",           "WI"): "Wisconsin",
    ("Appleton",         "WI"): "Wisconsin",
    # Tier 2 — MN
    ("Minneapolis",      "MN"): "Minnesota",
    ("St. Paul",         "MN"): "Minnesota",
    ("Rochester",        "MN"): "Minnesota",
    ("Duluth",           "MN"): "Minnesota",
    ("Bloomington",      "MN"): "Minnesota",
    ("Brooklyn Park",    "MN"): "Minnesota",
    # Tier 3 — AL
    ("Birmingham",       "AL"): "Alabama",
    ("Montgomery",       "AL"): "Alabama",
    ("Huntsville",       "AL"): "Alabama",
    ("Mobile",           "AL"): "Alabama",
    # Tier 3 — AK
    ("Anchorage",        "AK"): "Alaska",
    ("Fairbanks",        "AK"): "Alaska",
    ("Juneau",           "AK"): "Alaska",
    ("Wasilla",          "AK"): "Alaska",
    # Tier 3 — AR
    ("Little Rock",      "AR"): "Arkansas",
    ("Fort Smith",       "AR"): "Arkansas",
    ("Fayetteville",     "AR"): "Arkansas",
    ("Springdale",       "AR"): "Arkansas",
    # Tier 3 — CT
    ("Bridgeport",       "CT"): "Connecticut",
    ("New Haven",        "CT"): "Connecticut",
    ("Hartford",         "CT"): "Connecticut",
    ("Stamford",         "CT"): "Connecticut",
    # Tier 3 — DE
    ("Wilmington",       "DE"): "Delaware",
    ("Dover",            "DE"): "Delaware",
    ("Newark",           "DE"): "Delaware",
    ("Middletown",       "DE"): "Delaware",
    # Tier 3 — HI
    ("Honolulu",         "HI"): "Hawaii",
    ("Pearl City",       "HI"): "Hawaii",
    ("Hilo",             "HI"): "Hawaii",
    ("Kailua",           "HI"): "Hawaii",
    # Tier 3 — ID
    ("Boise",            "ID"): "Idaho",
    ("Nampa",            "ID"): "Idaho",
    ("Meridian",         "ID"): "Idaho",
    ("Idaho Falls",      "ID"): "Idaho",
    # Tier 3 — IA
    ("Des Moines",       "IA"): "Iowa",
    ("Cedar Rapids",     "IA"): "Iowa",
    ("Davenport",        "IA"): "Iowa",
    ("Sioux City",       "IA"): "Iowa",
    # Tier 3 — KS
    ("Wichita",          "KS"): "Kansas",
    ("Overland Park",    "KS"): "Kansas",
    ("Kansas City",      "KS"): "Kansas",
    ("Topeka",           "KS"): "Kansas",
    # Tier 3 — KY
    ("Louisville",       "KY"): "Kentucky",
    ("Lexington",        "KY"): "Kentucky",
    ("Bowling Green",    "KY"): "Kentucky",
    ("Owensboro",        "KY"): "Kentucky",
    # Tier 3 — LA
    ("New Orleans",      "LA"): "Louisiana",
    ("Baton Rouge",      "LA"): "Louisiana",
    ("Shreveport",       "LA"): "Louisiana",
    ("Lafayette",        "LA"): "Louisiana",
    # Tier 3 — ME
    ("Portland",         "ME"): "Maine",
    ("Lewiston",         "ME"): "Maine",
    ("Bangor",           "ME"): "Maine",
    ("South Portland",   "ME"): "Maine",
    # Tier 3 — MS
    ("Jackson",          "MS"): "Mississippi",
    ("Gulfport",         "MS"): "Mississippi",
    ("Southaven",        "MS"): "Mississippi",
    ("Hattiesburg",      "MS"): "Mississippi",
    # Tier 3 — MT
    ("Billings",         "MT"): "Montana",
    ("Missoula",         "MT"): "Montana",
    ("Great Falls",      "MT"): "Montana",
    ("Bozeman",          "MT"): "Montana",
    # Tier 3 — NE
    ("Omaha",            "NE"): "Nebraska",
    ("Lincoln",          "NE"): "Nebraska",
    ("Bellevue",         "NE"): "Nebraska",
    ("Grand Island",     "NE"): "Nebraska",
    # Tier 3 — NV
    ("Las Vegas",        "NV"): "Nevada",
    ("Henderson",        "NV"): "Nevada",
    ("Reno",             "NV"): "Nevada",
    ("North Las Vegas",  "NV"): "Nevada",
    # Tier 3 — NH
    ("Manchester",       "NH"): "New Hampshire",
    ("Nashua",           "NH"): "New Hampshire",
    ("Concord",          "NH"): "New Hampshire",
    ("Derry",            "NH"): "New Hampshire",
    # Tier 3 — NM
    ("Albuquerque",      "NM"): "New Mexico",
    ("Las Cruces",       "NM"): "New Mexico",
    ("Rio Rancho",       "NM"): "New Mexico",
    ("Santa Fe",         "NM"): "New Mexico",
    # Tier 3 — ND
    ("Fargo",            "ND"): "North Dakota",
    ("Bismarck",         "ND"): "North Dakota",
    ("Grand Forks",      "ND"): "North Dakota",
    ("Minot",            "ND"): "North Dakota",
    # Tier 3 — OK
    ("Oklahoma City",    "OK"): "Oklahoma",
    ("Tulsa",            "OK"): "Oklahoma",
    ("Norman",           "OK"): "Oklahoma",
    ("Broken Arrow",     "OK"): "Oklahoma",
    # Tier 3 — OR
    ("Portland",         "OR"): "Oregon",
    ("Salem",            "OR"): "Oregon",
    ("Eugene",           "OR"): "Oregon",
    ("Gresham",          "OR"): "Oregon",
    # Tier 3 — RI
    ("Providence",       "RI"): "Rhode Island",
    ("Warwick",          "RI"): "Rhode Island",
    ("Cranston",         "RI"): "Rhode Island",
    ("Pawtucket",        "RI"): "Rhode Island",
    # Tier 3 — SC
    ("Columbia",         "SC"): "South Carolina",
    ("Charleston",       "SC"): "South Carolina",
    ("North Charleston", "SC"): "South Carolina",
    ("Greenville",       "SC"): "South Carolina",
    # Tier 3 — SD
    ("Sioux Falls",      "SD"): "South Dakota",
    ("Rapid City",       "SD"): "South Dakota",
    ("Aberdeen",         "SD"): "South Dakota",
    ("Brookings",        "SD"): "South Dakota",
    # Tier 3 — UT
    ("Salt Lake City",   "UT"): "Utah",
    ("West Valley City", "UT"): "Utah",
    ("Provo",            "UT"): "Utah",
    ("West Jordan",      "UT"): "Utah",
    # Tier 3 — VT
    ("Burlington",       "VT"): "Vermont",
    ("South Burlington", "VT"): "Vermont",
    ("Rutland",          "VT"): "Vermont",
    ("Barre",            "VT"): "Vermont",
    # Tier 3 — WV
    ("Charleston",       "WV"): "West Virginia",
    ("Huntington",       "WV"): "West Virginia",
    ("Morgantown",       "WV"): "West Virginia",
    ("Parkersburg",      "WV"): "West Virginia",
    # Tier 3 — WY
    ("Cheyenne",         "WY"): "Wyoming",
    ("Casper",           "WY"): "Wyoming",
    ("Laramie",          "WY"): "Wyoming",
    ("Gillette",         "WY"): "Wyoming",
}

CITIES = [(city, sc, sn) for (city, sc), sn in CITY_MAP.items()]
assert len(CITIES) == 260, f"Expected 260 cities, got {len(CITIES)}"


# ── HELPERS ───────────────────────────────────────────────────────────────────

def load_tracking():
    if os.path.exists(TRACKING_FILE):
        with open(TRACKING_FILE) as f:
            return json.load(f)
    return {"launched_at": None, "runs": []}


def save_tracking(data):
    with open(TRACKING_FILE, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  Tracking saved → {TRACKING_FILE}")


def launch_one(city, state_code, state_name):
    payload = {
        "searchStringsArray":        [SEARCH_TERM],
        "locationQuery":             f"{city}, {state_name}, USA",
        "city":                      city,
        "state":                     state_name,
        "countryCode":               "us",
        "language":                  "en",
        "maxCrawledPlacesPerSearch": PLACES_LIMIT,
        "scrapeContacts":            SCRAPE_CONTACTS,
        "skipClosedPlaces":          True,
        "scrapePlaceDetailPage":     SCRAPE_DETAIL_PAGE,
        "maxReviews":                0,
        "maxImages":                 MAX_IMAGES,
    }
    resp = requests.post(
        BASE_URL,
        params={"token": APIFY_TOKEN, "memoryMbytes": MEMORY_MB},
        json=payload,
        timeout=30,
    )
    resp.raise_for_status()
    data       = resp.json()
    run_id     = data["data"]["id"]
    dataset_id = data["data"]["defaultDatasetId"]
    return {
        "city":        city,
        "state_code":  state_code,
        "state_name":  state_name,
        "run_id":      run_id,
        "dataset_id":  dataset_id,
        "status":      "RUNNING",
        "launched_at": datetime.utcnow().isoformat(),
        "items":       0,
    }


def check_run_status(run_id):
    resp = requests.get(
        f"https://api.apify.com/v2/actor-runs/{run_id}",
        params={"token": APIFY_TOKEN},
        timeout=15,
    )
    resp.raise_for_status()
    d = resp.json()["data"]
    return d["status"], d.get("stats", {}).get("itemCount", 0)


def get_dataset_count(dataset_id):
    """
    Fetch the true item count directly from the dataset API.
    For pay-per-event actors (like compass/crawler-google-places), stats.itemCount
    on the run object always returns 0. The dataset API is the only reliable source.
    """
    resp = requests.get(
        f"https://api.apify.com/v2/datasets/{dataset_id}",
        params={"token": APIFY_TOKEN},
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()["data"].get("itemCount", 0)


def fetch_dataset(dataset_id):
    results, offset, limit = [], 0, 100
    while True:
        resp = requests.get(
            f"https://api.apify.com/v2/datasets/{dataset_id}/items",
            params={"token": APIFY_TOKEN, "offset": offset, "limit": limit},
            timeout=30,
        )
        resp.raise_for_status()
        batch = resp.json()
        if not batch:
            break
        results.extend(batch)
        if len(batch) < limit:
            break
        offset += limit
    return results


def refresh_all_statuses(runs):
    """
    Refresh status + item count for every run from Apify. Updates runs in-place.
    For SUCCEEDED runs, fetches true item count from the dataset API directly,
    because stats.itemCount on the run object is always 0 for pay-per-event actors
    like compass/crawler-google-places.
    """
    print(f"  Refreshing {len(runs)} run statuses from Apify...")
    for run in runs:
        try:
            status, _ = check_run_status(run["run_id"])
            run["status"] = status
            # Always get real item count from dataset API — run stats.itemCount
            # is unreliable for pay-per-event actors and always returns 0
            if run.get("dataset_id"):
                try:
                    run["items"] = get_dataset_count(run["dataset_id"])
                except Exception:
                    run["items"] = 0
        except Exception as e:
            print(f"    Could not refresh {run['city']}, {run['state_code']}: {e}")


def flatten_record(item, city, state_code, state_name):
    def first(lst):
        return lst[0] if lst else ""

    emails    = [e for e in (item.get("emails") or []) if "@" in str(e)]

    # Image URLs — the actor returns up to MAX_IMAGES items in "imageUrls" (a flat
    # list of CDN strings), confirmed from compass/crawler-google-places output schema.
    # "imageUrl" (singular, top-level) is the primary thumbnail and is always present
    # when at least one image was scraped; it duplicates imageUrls[0].
    # We store each slot individually so they land in separate, addressable CSV columns.
    image_urls = item.get("imageUrls") or []
    return {
        "state":           state_name,
        "state_code":      state_code,
        "scraped_city":    city,
        "business_name":   item.get("title", ""),
        "category":        item.get("categoryName", ""),
        "address":         item.get("address", ""),
        "city":            item.get("city", ""),
        "state_field":     item.get("state", ""),
        "postal_code":     item.get("postalCode", ""),
        "phone":           item.get("phone", ""),
        "email":           first(emails),
        "all_emails":      "; ".join(emails),
        "website":         item.get("website", ""),
        "rating":          item.get("totalScore", ""),
        "reviews":         item.get("reviewsCount", ""),
        "latitude":        item.get("location", {}).get("lat", ""),
        "longitude":       item.get("location", {}).get("lng", ""),
        "facebook":        first(item.get("facebooks") or []),
        "instagram":       first(item.get("instagrams") or []),
        "linkedin":        first(item.get("linkedIns") or []),
        "youtube":         first(item.get("youtubes") or []),
        "tiktok":          first(item.get("tiktoks") or []),
        "twitter":         first(item.get("twitters") or []),
        "google_maps_url": item.get("url", ""),
        "image_url_1":     image_urls[0] if len(image_urls) > 0 else "",
        "image_url_2":     image_urls[1] if len(image_urls) > 1 else "",
        "image_url_3":     image_urls[2] if len(image_urls) > 2 else "",
    }


CSV_FIELDS = [
    "state", "state_code", "scraped_city", "business_name", "category",
    "address", "city", "state_field", "postal_code", "phone",
    "email", "all_emails", "website", "rating", "reviews",
    "latitude", "longitude", "facebook", "instagram", "linkedin",
    "youtube", "tiktok", "twitter", "google_maps_url",
    "image_url_1", "image_url_2", "image_url_3",
]


def _check_token():
    if APIFY_TOKEN == "YOUR_APIFY_TOKEN_HERE":
        print("ERROR: Set your APIFY_TOKEN before running.")
        print("  export APIFY_TOKEN=apify_api_xxxxxxxxxxxxxxxxxxxx")
        sys.exit(1)


# ── COMMANDS ──────────────────────────────────────────────────────────────────

def cmd_launch(tier=None):
    _check_token()

    # Optional tier filter
    if tier == "tier1":
        candidate_cities = [(c, sc, sn) for c, sc, sn in CITIES if sc in TIER1_CODES]
        tier_label = "Tier 1 (CA, TX, FL, NY) — 40 cities"
    elif tier == "tier2":
        candidate_cities = [(c, sc, sn) for c, sc, sn in CITIES if sc in TIER2_CODES]
        tier_label = "Tier 2 (18 states) — 108 cities"
    elif tier == "tier3":
        candidate_cities = [(c, sc, sn) for c, sc, sn in CITIES if sc in TIER3_CODES]
        tier_label = "Tier 3 (28 states) — 112 cities"
    elif tier is None:
        candidate_cities = CITIES
        tier_label = "All tiers — 260 cities"
    else:
        print(f"Unknown tier '{tier}'. Use: tier1, tier2, or tier3")
        sys.exit(1)

    tracking = load_tracking()
    # Only skip cities that already have good data (SUCCEEDED + items > 0)
    already  = {(r["city"], r["state_code"]) for r in tracking.get("runs", []) if has_data(r)}
    to_run   = [(c, sc, sn) for c, sc, sn in candidate_cities if (c, sc) not in already]

    if not to_run:
        print(f"All cities in {tier_label} already have data.")
        print("Run 'diagnose' to review or 'harvest' to export CSV.")
        return

    # ── BATCH EXECUTION ───────────────────────────────────────────────────────
    # MAX_WORKERS controls how many Apify runs are ACTIVE at once, not just how
    # many submission threads run. We submit a batch of MAX_WORKERS cities, poll
    # until every run in that batch reaches a terminal state (SUCCEEDED/FAILED/
    # ABORTED), then submit the next batch. This enforces the Starter plan's
    # combined memory ceiling: MAX_WORKERS(7) × MEMORY_MB(4096) = 28,672 MB
    # which stays safely under the 32,768 MB plan limit.
    # ─────────────────────────────────────────────────────────────────────────
    runs         = [r for r in tracking.get("runs", []) if has_data(r)]
    total        = len(to_run)
    success      = 0
    launch_failed = []
    poll_interval = 50   # seconds between status polls — each run takes ~150s, 3 polls covers it
    terminal      = {"SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"}

    print(f"\nLaunching {tier_label}")
    print(f"Strategy: batches of {MAX_WORKERS} at {MEMORY_MB}MB each "
          f"({MAX_WORKERS * MEMORY_MB:,} MB combined, limit 32,768 MB)")
    print(f"Total cities: {total} — "
          f"estimated time: ~{total // MAX_WORKERS + 1} batches\n")

    for batch_start in range(0, total, MAX_WORKERS):
        batch = to_run[batch_start:batch_start + MAX_WORKERS]
        batch_num = batch_start // MAX_WORKERS + 1
        total_batches = (total + MAX_WORKERS - 1) // MAX_WORKERS
        print(f"  Batch {batch_num}/{total_batches} — submitting {len(batch)} cities:")

        # Submit this batch
        batch_runs = []
        for city, sc, sn in batch:
            try:
                result = launch_one(city, sc, sn)
                batch_runs.append(result)
                runs.append(result)
                success += 1
                print(f"    ✓  {city}, {sc}  →  {result['run_id']}")
            except Exception as e:
                launch_failed.append((city, sc, str(e)))
                print(f"    ✗  {city}, {sc}  →  {e}")

        # Save progress after each batch submission
        tracking["launched_at"] = datetime.utcnow().isoformat()
        tracking["runs"]        = runs
        save_tracking(tracking)

        # Skip polling if this is the last batch — harvest will handle it
        if batch_start + MAX_WORKERS >= total:
            print(f"  Final batch submitted. Runs processing on Apify.")
            break

        # Poll until all runs in this batch reach a terminal state
        active_run_ids = {r["run_id"] for r in batch_runs}
        print(f"  Waiting for batch {batch_num} to complete before submitting next...")
        while active_run_ids:
            time.sleep(poll_interval)
            still_active = set()
            for run_id in active_run_ids:
                try:
                    status, items = check_run_status(run_id)
                    # Update the tracking record
                    for r in runs:
                        if r["run_id"] == run_id:
                            r["status"] = status
                            r["items"]  = items
                            break
                    # Update real item count from dataset API
                    for r in runs:
                        if r["run_id"] == run_id and r.get("dataset_id"):
                            try:
                                r["items"] = get_dataset_count(r["dataset_id"])
                            except Exception:
                                pass
                    if status not in terminal:
                        still_active.add(run_id)
                except Exception:
                    still_active.add(run_id)  # keep polling if check fails
            active_run_ids = still_active
            if active_run_ids:
                print(f"    Still running: {len(active_run_ids)} of {len(batch_runs)} — "
                      f"checking again in {poll_interval}s...")

        # Save updated statuses
        tracking["runs"] = runs
        save_tracking(tracking)
        completed = sum(1 for r in batch_runs if r.get("status") == "SUCCEEDED")
        print(f"  Batch {batch_num} complete: {completed}/{len(batch_runs)} SUCCEEDED.\n")

    print(f"\n  Submitted: {success}  |  Failed to submit: {len(launch_failed)}")
    if launch_failed:
        print("  Cities that failed to submit:")
        for city, sc, err in launch_failed:
            print(f"    {city}, {sc}: {err}")
    print(f"\n  python {sys.argv[0]} diagnose  ← check item counts per city")
    print(f"  python {sys.argv[0]} retry     ← re-submit any 0-item or failed runs")
    print(f"  python {sys.argv[0]} harvest   ← merge results into CSV when all done")


def cmd_status():
    tracking = load_tracking()
    runs     = tracking.get("runs", [])
    if not runs:
        print("No runs tracked yet. Run 'launch' first.")
        return

    refresh_all_statuses(runs)
    save_tracking(tracking)

    counts      = {"SUCCEEDED": 0, "RUNNING": 0, "ABORTED": 0, "FAILED": 0, "OTHER": 0}
    total_items = 0
    zero_item_succeeded = 0

    for run in runs:
        status = run.get("status", "OTHER")
        items  = run.get("items", 0)
        counts[status if status in counts else "OTHER"] += 1
        total_items += items
        if status == "SUCCEEDED" and items == 0:
            zero_item_succeeded += 1

    total     = len(runs)
    pct       = counts["SUCCEEDED"] / total * 100 if total else 0
    retryable = sum(1 for r in runs if needs_retry(r))

    print(f"\n{'─'*60}")
    print(f"  Total tracked:          {total:>4}  cities")
    print(f"  SUCCEEDED with data:    {counts['SUCCEEDED'] - zero_item_succeeded:>4}  ✓ ready to harvest")
    print(f"  SUCCEEDED, 0 items:     {zero_item_succeeded:>4}  ← need retry")
    print(f"  RUNNING:                {counts['RUNNING']:>4}  (still processing)")
    print(f"  ABORTED:                {counts['ABORTED']:>4}  ← need retry")
    print(f"  FAILED:                 {counts['FAILED']:>4}  ← need retry")
    print(f"  OTHER:                  {counts['OTHER']:>4}")
    print(f"  Total listings tracked: {total_items:>6}")
    print(f"  Progress:               {pct:.0f}% of runs completed")

    if retryable > 0:
        print(f"\n  {retryable} cities need retry → python {sys.argv[0]} retry")
        print(f"  Run 'diagnose' first to see exactly which cities.")
    elif counts["RUNNING"] == 0:
        print(f"\n  All done! → python {sys.argv[0]} harvest")
    else:
        print(f"\n  Still running — check back in a few minutes.")


def cmd_diagnose():
    tracking = load_tracking()
    runs     = tracking.get("runs", [])
    if not runs:
        print("No runs tracked yet. Run 'launch' first.")
        return

    refresh_all_statuses(runs)
    save_tracking(tracking)

    # Build lookup of tracked runs
    tracked = {(r["city"], r["state_code"]): r for r in runs}

    # Find cities not yet in tracking at all
    untracked = [(c, sc, sn) for c, sc, sn in CITIES if (c, sc) not in tracked]

    with_data   = [r for r in runs if has_data(r)]
    need_retry  = [r for r in runs if needs_retry(r)]
    running     = [r for r in runs if r.get("status") == "RUNNING"]

    print(f"\n{'─'*60}")
    print(f"  DIAGNOSE REPORT — {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"{'─'*60}")
    print(f"  Total cities in plan:   260")
    print(f"  Currently tracked:      {len(runs)}")
    print(f"  Not yet launched:       {len(untracked)}")
    print(f"  SUCCEEDED with data:    {len(with_data)}")
    print(f"  Still running:          {len(running)}")
    print(f"  Need retry:             {len(need_retry)}")
    print()

    if with_data:
        total_items = sum(r.get("items", 0) for r in with_data)
        print(f"  Cities with data ({len(with_data)}) — total {total_items} listings:")
        for r in sorted(with_data, key=lambda x: x.get("items", 0), reverse=True):
            print(f"    ✓  {r['city']:<22} {r['state_code']}  {r.get('items', 0):>4} listings")

    if need_retry:
        print(f"\n  Cities needing retry ({len(need_retry)}):")
        by_reason = {}
        for r in need_retry:
            reason = "0-item SUCCEEDED" if r.get("status") == "SUCCEEDED" else r.get("status", "?")
            by_reason.setdefault(reason, []).append(r)
        for reason, group in sorted(by_reason.items()):
            print(f"\n    Reason: {reason} ({len(group)} cities)")
            for r in sorted(group, key=lambda x: (x["state_code"], x["city"])):
                print(f"      {r['city']:<22} {r['state_code']}")

    if untracked:
        print(f"\n  Cities not yet launched ({len(untracked)}):")
        for c, sc, _ in sorted(untracked, key=lambda x: (x[1], x[0])):
            print(f"    {c:<22} {sc}")

    if running:
        print(f"\n  Cities still running ({len(running)}) — check back later:")
        for r in running:
            print(f"    {r['city']:<22} {r['state_code']}")

    print(f"\n{'─'*60}")
    if need_retry or untracked:
        print(f"  → Run 'retry' to re-submit the {len(need_retry) + len(untracked)} cities above.")
    elif running:
        print(f"  → {len(running)} runs still in progress. Run 'status' to check.")
    else:
        print(f"  → All cities have data! Run 'harvest' to export the CSV.")


def cmd_retry():
    _check_token()
    tracking = load_tracking()
    runs     = tracking.get("runs", [])
    if not runs:
        print("No runs tracked yet. Run 'launch' first.")
        return

    refresh_all_statuses(runs)

    # Separate into: keep (has good data or still running) vs retry
    # NOTE: retry only re-submits cities already in tracking that failed or
    # returned 0 items. It does NOT add untracked cities — if cities were
    # never launched (e.g. you only ran tier1), use 'launch' for those.
    to_keep  = [r for r in runs if has_data(r) or r.get("status") == "RUNNING"]
    to_retry = [(r["city"], r["state_code"]) for r in runs if needs_retry(r)]

    tracking["runs"] = to_keep
    save_tracking(tracking)

    protected = len(to_keep)
    print(f"\n  {protected} cities with good data protected — will NOT be re-submitted.")
    print(f"  {len(to_retry)} ABORTED/FAILED/0-item runs cleared from tracking.")
    print(f"  Re-launching {len(to_retry)} cities...\n")

    if not to_retry:
        print("Nothing to retry — all tracked cities have data.")
        print("  To launch cities that haven\'t run yet, use:")
        print(f'    python {{sys.argv[0]}} launch --search "{{SEARCH_TERM}}" [tier1|tier2|tier3]')
        return

    new_runs, success, still_failed = list(to_keep), 0, []

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {
            pool.submit(launch_one, city, sc, CITY_MAP[(city, sc)]): (city, sc)
            for city, sc in to_retry
        }
        for i, future in enumerate(as_completed(futures), 1):
            city, sc = futures[future]
            try:
                result = future.result()
                new_runs.append(result)
                success += 1
                print(f"  [{i:>3}/{len(to_retry)}] ✓  {city}, {sc}  →  {result['run_id']}")
            except Exception as e:
                still_failed.append((city, sc, str(e)))
                print(f"  [{i:>3}/{len(to_retry)}] ✗  {city}, {sc}  →  {e}")

    tracking["runs"] = new_runs
    save_tracking(tracking)
    print(f"\n  Re-launched: {success}  |  Still failing to submit: {len(still_failed)}")
    if still_failed:
        print("\n  Cities still failing to submit:")
        for city, sc, err in still_failed:
            print(f"    {city}, {sc}: {err}")
    print(f"\n  python {sys.argv[0]} status    ← check progress (30–60 min)")
    print(f"  python {sys.argv[0]} diagnose  ← full per-city breakdown")
    print(f"  python {sys.argv[0]} harvest   ← merge results when all done")


def cmd_reset():
    confirm = input(
        f"\nThis will DELETE {TRACKING_FILE} and lose all run history for \"{SEARCH_TERM}\".\n"
        "Type YES to confirm: "
    ).strip()
    if confirm == "YES":
        if os.path.exists(TRACKING_FILE):
            os.remove(TRACKING_FILE)
            print(f"  {TRACKING_FILE} deleted. Run 'launch' to start fresh.")
        else:
            print(f"  {TRACKING_FILE} not found — nothing to delete.")
    else:
        print("  Reset cancelled.")


def _is_excluded(record):
    """Return True if the record's category is in the exclusion list.
    Case-insensitive so 'Real Estate Agency' matches 'real estate agency'.
    """
    cat = (record.get("category") or "").lower().strip()
    return cat in EXCLUDE_CATEGORIES


def cmd_harvest():
    _check_token()
    tracking = load_tracking()
    runs     = tracking.get("runs", [])
    if not runs:
        print("No runs tracked yet. Run 'launch' first.")
        return

    # Harvest all SUCCEEDED runs — do NOT rely on the cached items field in
    # run_tracking.json, because compass/crawler-google-places is a pay-per-event
    # actor and stats.itemCount always returns 0 on the run object. The dataset
    # fetch itself is the ground truth for whether data exists.
    to_harvest = [r for r in runs if r.get("status") == "SUCCEEDED"]
    skipped    = [r for r in runs if r.get("status") != "SUCCEEDED"]

    if not to_harvest:
        print("No SUCCEEDED runs found. Run 'status' to check progress.")
        if skipped:
            print(f"  {len(skipped)} runs are not yet SUCCEEDED:")
            for r in skipped[:10]:
                print(f"    {r['city']}, {r['state_code']}: {r.get('status', '?')}")
            if len(skipped) > 10:
                print(f"    ... and {len(skipped) - 10} more")
        return

    print(f"\nHarvesting {len(to_harvest)} SUCCEEDED datasets "
          f"(skipping {len(skipped)} non-SUCCEEDED)...\n")

    all_records, fetch_errors = [], []

    for i, run in enumerate(to_harvest, 1):
        city, sc, sn = run["city"], run["state_code"], run["state_name"]
        try:
            raw      = fetch_dataset(run["dataset_id"])
            records  = [flatten_record(item, city, sc, sn) for item in raw]
            excluded = [rec for rec in records if _is_excluded(rec)]
            records  = [rec for rec in records if not _is_excluded(rec)]
            # Update the cached item count in tracking while we are here
            run["items"] = len(records)
            all_records.extend(records)
            excl_note = f"  ({len(excluded)} excluded)" if excluded else ""
            print(f"  [{i:>3}/{len(to_harvest)}] {city:<22} {sc}  →  {len(records)} listings{excl_note}")
        except Exception as e:
            fetch_errors.append((city, sc, str(e)))
            print(f"  [{i:>3}/{len(to_harvest)}] {city:<22} {sc}  →  ERROR: {e}")

    # Save updated item counts back to tracking
    tracking["runs"] = runs
    save_tracking(tracking)

    # Deduplicate on (business_name, phone)
    seen, dedup = set(), []
    for r in all_records:
        key = ((r["business_name"] or "").lower().strip(), (r["phone"] or "").strip())
        if key not in seen:
            seen.add(key)
            dedup.append(r)

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(dedup)

    empty = [r for r in to_harvest if r.get("items", 0) == 0 and r not in
             [e for e in fetch_errors]]
    total_excluded = sum(
        1 for r in runs if r.get("status") == "SUCCEEDED"
        for _ in []  # placeholder — we track excluded per-city above
    )
    print(f"\n{'─'*60}")
    print(f"  Datasets harvested:        {len(to_harvest):>6}")
    print(f"  Total raw listings:        {len(all_records):>6}")
    print(f"  Excluded (wrong category): see per-city count above")
    print(f"  After deduplication:       {len(dedup):>6}")
    print(f"  With email:                {sum(1 for r in dedup if r['email']):>6}")
    print(f"  Fetch errors:              {len(fetch_errors):>6}")
    print(f"  Excluded categories:       {', '.join(sorted(EXCLUDE_CATEGORIES)[:5])}...")
    print(f"  Output CSV:                {OUTPUT_CSV}")
    if skipped:
        print(f"\n  {len(skipped)} non-SUCCEEDED runs were skipped (not in CSV):")
        for r in skipped[:10]:
            print(f"    {r['city']}, {r['state_code']}: {r.get('status', '?')}")
        if len(skipped) > 10:
            print(f"    ... and {len(skipped) - 10} more")
        print(f"  Run 'retry' to re-submit them, then 'harvest' again.")



def cmd_kill():
    """
    Immediately abort all READY or RUNNING actor runs tracked in run_tracking.json.
    Calls POST https://api.apify.com/v2/actor-runs/{runId}/abort for each active run.
    Runs already in a terminal state (SUCCEEDED, FAILED, ABORTED, TIMED-OUT) are skipped.
    Updates run_tracking.json with the new ABORTED status for each killed run.
    """
    _check_token()
    tracking = load_tracking()
    runs     = tracking.get("runs", [])
    if not runs:
        print("No runs tracked. Nothing to kill.")
        return

    # Refresh all statuses first so we know what's actually active
    print(f"\nRefreshing status of {len(runs)} tracked runs...")
    refresh_all_statuses(runs)

    killable_statuses = {"READY", "RUNNING", "TIMING-OUT", "ABORTING"}
    to_kill   = [r for r in runs if r.get("status") in killable_statuses]
    already_done = [r for r in runs if r.get("status") not in killable_statuses]

    if not to_kill:
        print(f"  No active runs found — nothing to kill.")
        print(f"  {len(already_done)} runs are already in a terminal state.")
        return

    print(f"\n  {len(to_kill)} active runs will be aborted.")
    print(f"  {len(already_done)} runs already finished — will be left untouched.")

    confirm = input(f"\n  Type KILL to confirm aborting {len(to_kill)} runs: ").strip()
    if confirm != "KILL":
        print("  Cancelled — no runs were aborted.")
        return

    print()
    killed    = 0
    failed_to_kill = []

    for i, run in enumerate(to_kill, 1):
        city = run["city"]
        sc   = run["state_code"]
        run_id = run["run_id"]
        try:
            resp = requests.post(
                f"https://api.apify.com/v2/actor-runs/{run_id}/abort",
                params={"token": APIFY_TOKEN},
                timeout=15,
            )
            resp.raise_for_status()
            run["status"] = "ABORTED"
            killed += 1
            print(f"  [{i:>3}/{len(to_kill)}] ✓  Killed {city}, {sc}  (run {run_id})")
        except Exception as e:
            failed_to_kill.append((city, sc, str(e)))
            print(f"  [{i:>3}/{len(to_kill)}] ✗  Failed to kill {city}, {sc}: {e}")

    tracking["runs"] = runs
    save_tracking(tracking)

    print(f"\n{'─'*60}")
    print(f"  Runs killed:           {killed:>4}")
    print(f"  Failed to kill:        {len(failed_to_kill):>4}")
    print(f"  Already finished:      {len(already_done):>4}  (untouched)")
    if failed_to_kill:
        print("\n  Could not kill:")
        for city, sc, err in failed_to_kill:
            print(f"    {city}, {sc}: {err}")
    print(f"\n  Run 'retry' to re-submit aborted cities when ready.")


def cmd_trial():
    """
    Launch a 5-city trial run across 5 states — one from each tier — to validate
    the full pipeline before committing to a 260-city run.

    Trial cities (chosen to represent all three tiers):
      Los Angeles, CA  — Tier 1 (large metro)
      Chicago,     IL  — Tier 2 (mid-size state)
      Atlanta,     GA  — Tier 2 (mid-size state, different region)
      Las Vegas,   NV  — Tier 3 (smaller state)
      Portland,    OR  — Tier 3 (smaller state, different region)

    Uses a separate tracking file and CSV (prefixed with "trial_") so it never
    touches or overwrites your main run data for the same search term.
    Run 'harvest' (not 'trial') after verifying results to get the full CSV.
    """
    _check_token()

    TRIAL_CITIES = [
        ("Los Angeles", "CA", "California"),   # Tier 1
        ("Chicago",     "IL", "Illinois"),     # Tier 2
        ("Atlanta",     "GA", "Georgia"),      # Tier 2 — different region
        ("Las Vegas",   "NV", "Nevada"),       # Tier 3
        ("Portland",    "OR", "Oregon"),       # Tier 3 — different region
    ]

    # Trial uses its own isolated tracking and CSV files
    slug           = SEARCH_TERM.lower().strip().replace(" ", "_").replace("/", "_")
    trial_tracking = f"trial_run_tracking_{slug}.json"
    trial_csv      = f"trial_{slug}_results.csv"

    # Load trial-specific tracking (separate from main run)
    if os.path.exists(trial_tracking):
        with open(trial_tracking) as f:
            tracking = json.load(f)
    else:
        tracking = {"launched_at": None, "runs": []}

    already  = {(r["city"], r["state_code"]) for r in tracking.get("runs", [])
                if r.get("status") == "SUCCEEDED"}
    to_run   = [(c, sc, sn) for c, sc, sn in TRIAL_CITIES if (c, sc) not in already]

    print(f"\nTrial run — 5 cities across 5 states")
    print(f"  Search term:     \"{SEARCH_TERM}\"")
    print(f"  Tracking file:   {trial_tracking}  (isolated from main run)")
    print(f"  Output CSV:      {trial_csv}")
    print(f"  Memory per run:  {MEMORY_MB} MB")
    print()

    if not to_run:
        print("All 5 trial cities already succeeded. Running harvest on trial data...")
        _harvest_to_file(tracking, trial_csv)
        return

    print(f"  Submitting {len(to_run)} city runs:\n")

    runs         = tracking.get("runs", [])
    success      = 0
    launch_failed = []
    poll_interval = 50
    terminal      = {"SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"}

    # All 5 fit in one batch (well under 7-run memory ceiling)
    batch_runs = []
    for city, sc, sn in to_run:
        try:
            result = launch_one(city, sc, sn)
            batch_runs.append(result)
            runs.append(result)
            success += 1
            print(f"    ✓  {city}, {sc}  →  {result['run_id']}")
        except Exception as e:
            launch_failed.append((city, sc, str(e)))
            print(f"    ✗  {city}, {sc}  →  {e}")

    tracking["launched_at"] = datetime.utcnow().isoformat()
    tracking["runs"]        = runs
    with open(trial_tracking, "w") as f:
        json.dump(tracking, f, indent=2)
    print(f"\n  Tracking saved → {trial_tracking}")

    if launch_failed:
        print(f"\n  Failed to submit:")
        for city, sc, err in launch_failed:
            print(f"    {city}, {sc}: {err}")
        return

    # Poll until all trial runs complete
    print(f"\n  Waiting for all {len(batch_runs)} runs to complete (polling every {poll_interval}s)...")
    active_run_ids = {r["run_id"] for r in batch_runs}
    poll_count = 0
    while active_run_ids:
        time.sleep(poll_interval)
        poll_count += 1
        still_active = set()
        for run_id in active_run_ids:
            try:
                status, _ = check_run_status(run_id)
                for r in runs:
                    if r["run_id"] == run_id:
                        r["status"] = status
                        if status == "SUCCEEDED" and r.get("dataset_id"):
                            try:
                                r["items"] = get_dataset_count(r["dataset_id"])
                            except Exception:
                                pass
                        break
                if status not in terminal:
                    still_active.add(run_id)
            except Exception:
                still_active.add(run_id)
        active_run_ids = still_active
        if active_run_ids:
            print(f"    Poll {poll_count}: {len(active_run_ids)} still running — checking again in {poll_interval}s...")

    tracking["runs"] = runs
    with open(trial_tracking, "w") as f:
        json.dump(tracking, f, indent=2)

    # Report results
    succeeded = [r for r in batch_runs if r.get("status") == "SUCCEEDED"]
    failed    = [r for r in batch_runs if r.get("status") != "SUCCEEDED"]
    print(f"\n  {'─'*50}")
    print(f"  Trial complete:")
    print(f"    SUCCEEDED:  {len(succeeded)}")
    print(f"    FAILED:     {len(failed)}")
    for r in succeeded:
        print(f"    ✓  {r['city']:<20} {r['state_code']}  {r.get('items', 0):>4} listings")
    for r in failed:
        print(f"    ✗  {r['city']:<20} {r['state_code']}  {r.get('status', '?')}")

    if succeeded:
        print()
        _harvest_to_file(tracking, trial_csv)
        print(f"\n  Trial CSV written → {trial_csv}")
        print(f"  If results look good, run the full launch:")
        print(f'    python {sys.argv[0]} launch --search "{SEARCH_TERM}"')
    else:
        print(f"\n  No cities succeeded. Check the errors above before running the full launch.")


def _harvest_to_file(tracking, csv_path):
    """Internal helper — fetch all SUCCEEDED datasets and write to csv_path."""
    runs       = tracking.get("runs", [])
    succeeded  = [r for r in runs if r.get("status") == "SUCCEEDED"]
    all_records, fetch_errors = [], []

    for r in succeeded:
        city, sc, sn = r["city"], r["state_code"], r["state_name"]
        try:
            raw      = fetch_dataset(r["dataset_id"])
            records  = [flatten_record(item, city, sc, sn) for item in raw]
            excluded = [rec for rec in records if _is_excluded(rec)]
            records  = [rec for rec in records if not _is_excluded(rec)]
            r["items"] = len(records)
            all_records.extend(records)
            excl_note = f"  ({len(excluded)} excluded)" if excluded else ""
            print(f"    {city:<20} {sc}  →  {len(records)} listings{excl_note}")
        except Exception as e:
            fetch_errors.append((city, sc, str(e)))
            print(f"    {city:<20} {sc}  →  ERROR: {e}")

    seen, dedup = set(), []
    for rec in all_records:
        key = ((rec["business_name"] or "").lower().strip(), (rec["phone"] or "").strip())
        if key not in seen:
            seen.add(key)
            dedup.append(rec)

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(dedup)

    print(f"  Total: {len(all_records)} raw → {len(dedup)} deduplicated listings")

# ── ENTRY POINT ───────────────────────────────────────────────────────────────

COMMANDS = {
    "launch":   cmd_launch,
    "status":   cmd_status,
    "diagnose": cmd_diagnose,
    "retry":    cmd_retry,
    "kill":     cmd_kill,
    "reset":    cmd_reset,
    "harvest":  cmd_harvest,
    "trial":    cmd_trial,
}

def parse_args():
    """
    Parse command-line arguments. Returns (command, search_term, tier).
    --search "some service" is required for all commands.
    tier (tier1/tier2/tier3) is optional for launch only.

    Examples:
      launch --search "junk hauling"
      launch --search "estate cleanout" tier1
      status --search "junk hauling"
      harvest --search "estate cleanout"
    """
    args = sys.argv[1:]

    if not args or args[0] not in COMMANDS:
        print(__doc__)
        print(f'Usage: python {sys.argv[0]} <command> --search "search term" [tier1|tier2|tier3]')
        print(f'Commands: launch, trial, status, diagnose, retry, kill, reset, harvest')
        print(f"Commands: {', '.join(COMMANDS.keys())}")
        sys.exit(1)

    cmd  = args[0]
    rest = args[1:]

    # Extract --search value
    search_term = None
    tier        = None
    i = 0
    remaining = []
    while i < len(rest):
        if rest[i] == "--search" and i + 1 < len(rest):
            search_term = rest[i + 1]
            i += 2
        elif rest[i].startswith("--search="):
            search_term = rest[i].split("=", 1)[1]
            i += 1
        elif rest[i] in ("tier1", "tier2", "tier3") and cmd == "launch":
            tier = rest[i]
            i += 1
        else:
            remaining.append(rest[i])
            i += 1

    if search_term is None:
        print(f"ERROR: --search is required for all commands.")
        print(f'Example: python {sys.argv[0]} {cmd} --search "junk hauling"')
        sys.exit(1)

    return cmd, search_term.strip(), tier


if __name__ == "__main__":
    cmd, search_term, tier = parse_args()

    # Set dynamic globals based on search term
    import builtins
    TRACKING_FILE, OUTPUT_CSV = make_filenames(search_term)

    # Inject into module globals so all functions pick them up
    import __main__
    __main__.SEARCH_TERM   = search_term
    __main__.TRACKING_FILE = TRACKING_FILE
    __main__.OUTPUT_CSV    = OUTPUT_CSV

    # Patch module-level names used inside functions
    import sys as _sys
    current_module = _sys.modules[__name__]
    current_module.SEARCH_TERM   = search_term
    current_module.TRACKING_FILE = TRACKING_FILE
    current_module.OUTPUT_CSV    = OUTPUT_CSV

    print(f"  Search term:    \"{search_term}\"")
    print(f"  Tracking file:  {TRACKING_FILE}")
    print(f"  Output CSV:     {OUTPUT_CSV}")
    print()

    if cmd == "launch":
        cmd_launch(tier=tier)
    else:
        COMMANDS[cmd]()
