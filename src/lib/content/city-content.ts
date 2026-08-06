import type { Category } from '@/types'

export interface CityContent {
  /** 2 paragraphs, 150–250 words combined */
  intro: string[]
  priceRange: {
    low: number
    high: number
    unit: string
    note?: string
  }
  faqs: { q: string; a: string }[]
}

function key(category: Category, stateAbbr: string, citySlug: string): string {
  return `${category}:${stateAbbr.toUpperCase()}:${citySlug}`
}

const CITY_CONTENT: Record<string, CityContent> = {
  [key('junk_removal', 'MO', 'kansas-city')]: {
    intro: [
      "Kansas City's older neighborhoods — Brookside, Waldo, and the bungalow-lined streets of the Historic Northeast — generate a steady stream of junk removal calls, from garage cleanouts after a move to hauling away flood-damaged belongings when the Blue River or a heavy spring storm backs up a basement. Renovation debris is common too, as homeowners in Waldo and the Northland strip out mid-century kitchens and finish basements room by room, and cleanup after a Missouri hailstorm or a burst pipe often means tossing waterlogged carpet, drywall, and furniture at the curb before mold sets in.",
      "Landlords near Westport and the university area also lean on junk removal crews to turn apartments over quickly between tenants, while businesses along the Independence Avenue corridor need commercial cleanouts after a closure or remodel. Sellers preparing a Brookside or Waldo bungalow for the market often call for a single large pickup to clear a garage, attic, or basement before showings begin. Whatever the trigger, local haulers know how to navigate KC's mix of narrow city streets and sprawling suburban driveways to get junk out fast.",
    ],
    priceRange: { low: 125, high: 550, unit: 'per load', note: 'Price depends on volume, item type, and how easy the load is to access.' },
    faqs: [
      { q: 'How much does junk removal cost in Kansas City, MO?', a: 'Most single-item or partial-truck loads run $125–$550, depending on volume, weight, and how far items have to be carried to the truck. Full-home or estate-size loads can run higher.' },
      { q: 'Do I need to be present for a junk removal pickup?', a: "Many Kansas City haulers offer curbside or garage pickups you don't need to attend in person, but it's best to confirm with the company when you book." },
      { q: 'What items won’t junk removal companies take in Kansas City?', a: 'Most crews can’t take hazardous materials like paint, chemicals, or asbestos, and some limit large appliances containing refrigerants unless properly certified.' },
      { q: 'Can I get same-day junk removal in Kansas City?', a: 'Same-day and next-day appointments are common, especially outside of peak moving season in late spring and summer — book a few days ahead when possible.' },
    ],
  },
  [key('estate_cleanout', 'MO', 'kansas-city')]: {
    intro: [
      "Kansas City's aging housing stock in neighborhoods like Brookside and the Historic Northeast means estate cleanouts are a regular part of settling a loved one's affairs here, often working alongside a Jackson County probate attorney to clear a family home before it's sold. Many of these houses have stayed in the same family for decades, so cleanout crews are used to sorting through generations of belongings — furniture, tools, holiday decorations, and keepsakes tucked into attics and basements — room by room, and often working around family members who are grieving as much as they're sorting.",
      "Downsizing is just as common, as older residents move from long-time houses in Waldo or the Northland into senior communities near the Country Club Plaza or Overland Park, needing help separating what to keep, donate, or discard. Estate cleanout companies serving Kansas City typically coordinate with realtors, executors, and family members scattered across multiple states to have a home move-in ready — or listing-ready — on a tight timeline.",
    ],
    priceRange: { low: 1200, high: 4500, unit: 'per full home', note: 'Final cost depends on home size, volume of belongings, and whether donation or resale sorting is included.' },
    faqs: [
      { q: 'How much does an estate cleanout cost in Kansas City, MO?', a: 'A full-home estate cleanout typically runs $1,200–$4,500, depending on the size of the home and how much sorting, donation, or disposal is involved.' },
      { q: 'How does estate cleanout work after a loved one passes away?', a: 'A crew walks the home with the family (or executor) to identify items to keep, then sorts, removes, and disposes of or donates the rest — often over one to a few days.' },
      { q: 'Can an estate cleanout company work with our probate attorney or Jackson County probate court timeline?', a: 'Yes — most established Kansas City estate cleanout companies regularly coordinate with attorneys, executors, and realtors to meet closing or listing deadlines.' },
      { q: 'Will an estate cleanout crew set aside valuables or sentimental items?', a: 'Reputable companies flag anything that looks valuable or sentimental — jewelry, documents, photos — for the family to review before it’s removed.' },
    ],
  },

  [key('junk_removal', 'AZ', 'mesa')]: {
    intro: [
      "Mesa's mix of long-time desert homesteads and newer master-planned communities like Eastmark means junk removal crews handle everything from decades of accumulated belongings in a Dobson Ranch backyard shed to construction debris from the area's constant new-home building. Snowbirds who spend winters in 55+ communities such as Sunland Village or Leisure World also call for seasonal cleanouts before heading back north each spring, often needing a single crew to clear out a garage, patio, and guest room all at once before the property sits empty for the summer.",
      "The desert climate takes its toll on appliances, patio furniture, and pool equipment, so hauling out sun-worn items is a year-round need across Mesa neighborhoods like Red Mountain and Downtown Mesa. Renovation projects in older Mesa ranch homes near Alma School Road and Southern Avenue also generate cabinetry, flooring, and drywall debris. Same-day and next-day pickup matters here especially in the summer heat, when nobody wants old junk sitting in a driveway.",
    ],
    priceRange: { low: 100, high: 500, unit: 'per load', note: 'Larger loads like shed or garage cleanouts run toward the higher end.' },
    faqs: [
      { q: 'How much does junk removal cost in Mesa, AZ?', a: 'Typical loads run $100–$500 depending on volume — a single appliance or a few bags costs less than a full garage or shed cleanout.' },
      { q: 'Do junk removal companies in Mesa haul away old pool or patio equipment?', a: 'Most do, including patio furniture, above-ground pool equipment, and sun-damaged outdoor items — confirm with the company if the item is oversized.' },
      { q: 'Can I book junk removal in Mesa for a seasonal or snowbird cleanout?', a: 'Yes, many Mesa crews are used to scheduling seasonal cleanouts for part-time residents heading out of state, including flexible key-access arrangements.' },
      { q: 'How fast can I get a junk removal appointment in Mesa?', a: 'Same-day or next-day service is common outside of the busiest fall move-in season for 55+ communities.' },
    ],
  },
  [key('estate_cleanout', 'AZ', 'mesa')]: {
    intro: [
      "With one of the largest concentrations of retiree and 55+ communities in the Phoenix metro — Sunland Village, Leisure World, and Dreamland Villa among them — Mesa sees frequent estate cleanouts after a resident passes away or moves into assisted living. Families are often coordinating from out of state, so local companies that can manage an entire home's contents without much hand-holding are especially valuable here, from clearing a garage full of golf clubs and tools to packing up decades of holiday décor stored for Arizona's mild winters.",
      "Downsizing cleanouts are just as frequent in neighborhoods like Dobson Ranch and Las Sendas, where longtime homeowners are moving into smaller Mesa properties or relocating to be near family. Estate cleanout crews familiar with Maricopa County probate timelines can help get a house ready for market without delay, often working alongside a realtor who needs the property staged and photo-ready within a matter of days rather than weeks.",
    ],
    priceRange: { low: 1200, high: 4500, unit: 'per full home', note: 'Homes in 55+ communities are often smaller, which can bring costs toward the lower end.' },
    faqs: [
      { q: 'How much does an estate cleanout cost in Mesa, AZ?', a: 'Full-home cleanouts typically run $1,200–$4,500. Homes in Mesa’s 55+ communities are often smaller than average, which can lower the total.' },
      { q: 'Can an out-of-state family manage a Mesa estate cleanout remotely?', a: 'Yes — most Mesa estate cleanout companies regularly work with out-of-state families and executors, coordinating access, photos, and updates remotely.' },
      { q: 'Does an estate cleanout company work with Maricopa County probate timelines?', a: 'Established companies are used to coordinating cleanout schedules around probate and closing deadlines set by the family or their attorney.' },
      { q: 'What happens to furniture and belongings that aren’t kept by the family?', a: 'Most companies donate usable items to local charities, recycle what they can, and dispose of the rest — ask for a donation receipt if you need one.' },
    ],
  },

  [key('junk_removal', 'NY', 'brooklyn')]: {
    intro: [
      "Junk removal in Brooklyn comes with a challenge most of the country doesn't deal with: walk-up apartments. From fourth-floor units in Bed-Stuy and Bushwick to pre-war buildings in Park Slope, crews need to carry furniture and bags down narrow stairwells, so experience with tight NYC buildings matters as much as the truck out front. Apartment turnover is constant, and outgoing tenants in Sunset Park and Flatbush regularly need fast pickups between move-out and move-in dates, often on the first of the month when leases citywide tend to turn over at once.",
      "Brownstone renovations across Bed-Stuy and Crown Heights also generate heavy construction and demo debris, while landlords near Bay Ridge and Sheepshead Bay call for bulk pickups after a unit is vacated ahead of a new lease. Curbside pickup rules, alternate-side parking, and building loading-dock restrictions make it worth booking a Brooklyn-based crew that already knows the borough's logistics rather than a company unfamiliar with narrow streets and limited parking windows.",
    ],
    priceRange: { low: 200, high: 800, unit: 'per load', note: 'Walk-up buildings and limited street parking can add a labor surcharge compared to ground-floor pickups.' },
    faqs: [
      { q: 'How much does junk removal cost in Brooklyn, NY?', a: 'Typical loads run $200–$800. Walk-up apartments, long carry distances, and limited parking can push costs toward the higher end.' },
      { q: 'Can junk removal companies handle walk-up apartments in Brooklyn?', a: 'Yes — most Brooklyn crews regularly work in fourth- and fifth-floor walk-ups; it’s worth mentioning the floor and whether there’s an elevator when booking.' },
      { q: 'Do I need a certificate of insurance for a Brooklyn co-op or condo pickup?', a: 'Some buildings require a certificate of insurance (COI) and a scheduled service elevator window — check with your building management before booking.' },
      { q: 'How quickly can I book junk removal in Brooklyn?', a: 'Same-day or next-day appointments are common outside of peak moving weekends at the start and end of each month.' },
    ],
  },
  [key('estate_cleanout', 'NY', 'brooklyn')]: {
    intro: [
      "Many Brooklyn brownstones and rowhouses in neighborhoods like Park Slope, Bed-Stuy, and Flatbush have been held by the same family for two or three generations, so an estate cleanout here often means clearing a house full of decades of belongings — furniture, papers, and family heirlooms tucked into parlor floors, garden-level storage, and attics — room by room, floor by floor. Probate can move slowly in Kings County, and families are frequently balancing a cleanout with getting a property ready to sell in a competitive market where every week of delay matters.",
      "Co-op and condo estates in areas like Bay Ridge and Sheepshead Bay bring their own rules, since many buildings require certificates of insurance and scheduled elevator time for movers. Brooklyn estate cleanout companies that know how to work within building management requirements, alternate-side parking, and narrow brownstone stoops can save a family real time and stress during an already difficult process, especially when relatives are coordinating the job from out of state.",
    ],
    priceRange: { low: 2000, high: 6000, unit: 'per full home', note: 'Multi-floor brownstones and buildings requiring elevator scheduling or COIs tend to run toward the higher end.' },
    faqs: [
      { q: 'How much does an estate cleanout cost in Brooklyn, NY?', a: 'Full-property cleanouts typically run $2,000–$6,000, with multi-floor brownstones and buildings that require elevator scheduling running higher than a single-floor apartment.' },
      { q: 'How long does a full estate cleanout take in Brooklyn?', a: 'A single apartment can often be cleared in a day; a full multi-floor brownstone with decades of belongings can take several days to a week.' },
      { q: 'Do estate cleanout companies work with Kings County probate attorneys?', a: 'Yes — most established Brooklyn estate cleanout companies are used to coordinating with attorneys and executors around probate and closing timelines.' },
      { q: 'Can a cleanout crew work around my co-op or condo building’s move-out rules?', a: 'Reputable companies will provide a certificate of insurance and work within your building’s scheduled elevator or loading-dock windows.' },
    ],
  },

  [key('junk_removal', 'NY', 'albany')]: {
    intro: [
      "Albany's Pine Hills and Center Square neighborhoods are full of century-old rowhouses and Victorians, and junk removal crews here are used to hauling old furniture and renovation debris down narrow staircases the same way they've handled decades of turnover near the SUNY Albany campus. With thousands of students moving in and out each August, landlords and property managers around Washington Park and the university area rely on quick bulk pickups to get units ready for the next lease before classes start.",
      "State government employment also drives a steady stream of relocations in and out of the Capital Region, meaning Albany crews regularly handle full-apartment and full-office cleanouts on tight moving timelines tied to a new job start date. Basement and attic cleanouts are common too, since much of Albany's housing stock predates modern storage standards, and older homes near the Mansion neighborhood often turn up decades of accumulated belongings when a house finally gets renovated.",
    ],
    priceRange: { low: 125, high: 550, unit: 'per load', note: 'Costs rise for basement or attic loads that require extra carrying distance in older homes.' },
    faqs: [
      { q: 'How much does junk removal cost in Albany, NY?', a: 'Typical loads run $125–$550, with attic and basement cleanouts in older Pine Hills or Center Square homes running toward the higher end due to carry distance.' },
      { q: 'Do junk removal companies in Albany handle student move-out cleanouts?', a: 'Yes — many Albany crews specifically staff up for the August turnover near SUNY Albany and offer bulk pickup rates for landlords and property managers.' },
      { q: 'What can’t junk removal companies take in Albany?', a: 'Most crews can’t take hazardous waste like paint or chemicals; check with the company about large appliances or electronics, which sometimes need separate recycling.' },
      { q: 'Can I schedule junk removal in Albany around a state job relocation?', a: 'Most companies offer flexible short-notice scheduling, which helps when a move date is tied to a state employment transfer.' },
    ],
  },
  [key('estate_cleanout', 'NY', 'albany')]: {
    intro: [
      "Albany's older neighborhoods — Pine Hills, Center Square, and the Mansion District — are home to many longtime families, and estate cleanouts here often involve clearing a Victorian or rowhouse that's held generations of belongings in its attic and basement. Families frequently work through Albany County Surrogate's Court probate proceedings while sorting a home's contents, and local cleanout companies are used to coordinating around that timeline, including cases where multiple siblings are dividing an estate and need items sorted, photographed, and set aside before anything leaves the house.",
      "Downsizing moves are also common as longtime Capital Region residents relocate to smaller homes or senior living communities in the area, needing help separating furniture and keepsakes worth keeping from the rest. Whether it's a family estate near Buckingham Lake or a downtown rowhouse, Albany cleanout crews are accustomed to working carefully in older homes with narrow doorways, tight stairwells, and delicate original woodwork that needs protecting during the process.",
    ],
    priceRange: { low: 1200, high: 4000, unit: 'per full home', note: 'Narrow staircases and multi-story Victorians in older Albany neighborhoods can add to labor time.' },
    faqs: [
      { q: 'How much does an estate cleanout cost in Albany, NY?', a: 'Full-home cleanouts typically run $1,200–$4,000, with older multi-story Victorians in Pine Hills or Center Square running toward the higher end.' },
      { q: 'Do estate cleanout companies in Albany work with Surrogate’s Court probate timelines?', a: 'Yes — most established companies coordinate with families, executors, and attorneys handling Albany County Surrogate’s Court proceedings.' },
      { q: 'What happens to items in an Albany estate cleanout that the family doesn’t want?', a: 'Most companies sort items for donation to local charities or resale, recycle what they can, and dispose of the remainder.' },
      { q: 'Can a cleanout crew handle a full attic and basement in an older Albany home?', a: 'Yes — Albany crews are used to clearing attics and basements in century-old homes, including narrow staircases and tight access points.' },
    ],
  },

  [key('junk_removal', 'NC', 'charlotte')]: {
    intro: [
      "Charlotte's rapid growth means junk removal crews stay busy with two very different jobs: hauling construction and renovation debris from teardown-and-rebuild projects in older neighborhoods like Dilworth and Myers Park, and clearing out apartments for the steady wave of newcomers relocating for banking and corporate jobs in South End and Uptown. NoDa and Plaza Midwood's older bungalows also generate plenty of garage and basement cleanouts as homeowners renovate century-old homes room by room to keep up with rising property values nearby.",
      "Fast-growing suburbs like Ballantyne and University City add new-construction debris and move-in/move-out cleanouts to the mix, especially as families relocate from out of state for jobs at the city's growing list of corporate headquarters. With Charlotte's population growing every year, same-day and next-day junk pickup is in high demand across the metro, particularly during the busy summer relocation season when moving trucks line up on nearly every block and apartment complexes turn over dozens of units at once.",
    ],
    priceRange: { low: 125, high: 550, unit: 'per load', note: 'Renovation and teardown debris loads run toward the higher end of the range.' },
    faqs: [
      { q: 'How much does junk removal cost in Charlotte, NC?', a: 'Typical loads run $125–$550. Renovation debris from teardown or remodel projects in neighborhoods like Dilworth tends to cost more due to volume.' },
      { q: 'Can junk removal companies in Charlotte handle a corporate relocation move-out?', a: 'Yes — many Charlotte crews specialize in fast apartment and home move-out cleanouts to support the area’s steady stream of corporate relocations.' },
      { q: 'Do Charlotte junk removal companies take construction debris?', a: 'Most do, including drywall, flooring, and cabinetry from renovations — confirm weight limits for larger teardown or demo projects.' },
      { q: 'How fast can I book junk removal in Charlotte?', a: 'Same-day or next-day service is widely available, though it’s worth booking a few days ahead during peak moving season in summer.' },
    ],
  },
  [key('estate_cleanout', 'NC', 'charlotte')]: {
    intro: [
      "As Charlotte has grown into a major banking and corporate hub, many longtime families in neighborhoods like Dilworth, Myers Park, and Plaza Midwood are selling homes that have been in the family for decades, and estate cleanouts are often the first step — clearing furniture, belongings, and years of accumulated items before a listing goes up in Charlotte's fast-moving real estate market, where homes in these neighborhoods can attract offers within days of hitting the market. Families going through Mecklenburg County probate frequently need a cleanout completed on a tight timeline to meet a closing date.",
      "Downsizing is common too, as older residents move from larger homes near Myers Park or NoDa into smaller properties or senior living communities closer to family. Charlotte estate cleanout companies are used to working quickly without sacrificing care, especially when a home needs to be market-ready fast and the family is coordinating showings, repairs, and a cleanout all in the same short window.",
    ],
    priceRange: { low: 1500, high: 5000, unit: 'per full home', note: 'Larger homes in neighborhoods like Myers Park run toward the higher end.' },
    faqs: [
      { q: 'How much does an estate cleanout cost in Charlotte, NC?', a: 'Full-home cleanouts typically run $1,500–$5,000, with larger homes in neighborhoods like Myers Park running toward the higher end.' },
      { q: 'How fast can an estate cleanout be done before a Charlotte home sale closes?', a: 'Many companies can complete a full-home cleanout in a few days to a week, and can prioritize jobs with a tight closing deadline.' },
      { q: 'Do estate cleanout companies work with Mecklenburg County probate attorneys?', a: 'Yes — established Charlotte companies regularly coordinate with attorneys, executors, and realtors managing probate and listing timelines.' },
      { q: 'Will an estate cleanout company help get a Charlotte home market-ready?', a: 'Most offer a full clear-out plus light cleaning so the home is ready for staging or photos, though deep cleaning is usually a separate service.' },
    ],
  },

  [key('junk_removal', 'IL', 'chicago')]: {
    intro: [
      "Chicago's iconic two- and three-flats in Wicker Park, Logan Square, and Pilsen keep junk removal crews busy year-round, especially as owners gut-renovate century-old buildings floor by floor and haul out old kitchens, plaster, and flooring debris. The city's alley-based garbage system is a wrinkle most out-of-town haulers don't expect — a lot of pickups happen from the alley behind the building rather than the curb, so local crews who know a block's alley access and gangway width move faster than newcomers. In the bungalow belt neighborhoods of Beverly, Mount Greenwood, and Portage Park, longtime homeowners regularly call for garage and basement cleanouts after decades of accumulated tools, furniture, and holiday decorations.",
      "Apartment turnover drives a steady stream of work too, particularly around October 1 and May 1, when a huge share of Chicago leases turn over on the same days — a tradition landlords near Rogers Park, Uptown, and Lakeview still call 'moving day.' High-rise condo buildings in the Loop and Streeterville add their own logistics, since junk removal often has to be scheduled around a freight elevator window and building management approval. Bridgeport and Pilsen's industrial corridors also generate commercial cleanouts after a business closes or relocates, and Chicago's brutal winters mean burst pipes and storm damage keep haulers busy clearing water-damaged belongings well into spring.",
    ],
    priceRange: { low: 150, high: 650, unit: 'per load', note: 'Walk-up buildings, alley access, and higher-floor pickups push costs toward the top of the range.' },
    faqs: [
      { q: 'How much does junk removal cost in Chicago, IL?', a: 'Typical loads run $150–$650, with walk-up buildings, alley access, and higher-floor pickups pushing toward the top of the range.' },
      { q: 'Do Chicago junk haulers pick up from the alley or the street?', a: "Most buildings in Chicago use alley-based garbage collection, so crews typically haul from the alley behind the property rather than the curb — confirm access with your hauler ahead of time." },
      { q: 'Can junk removal companies handle high-rise condo pickups in the Loop or Streeterville?', a: 'Yes, but many buildings require scheduling a freight elevator window and clearing the pickup with building management in advance.' },
      { q: 'How fast can I book junk removal in Chicago?', a: 'Same-day or next-day service is common outside of the citywide October 1 and May 1 moving days, when demand spikes.' },
    ],
  },
  [key('estate_cleanout', 'IL', 'chicago')]: {
    intro: [
      "Chicago's bungalow belt — Beverly, Mount Greenwood, and Portage Park — is full of homes that have stayed in the same family for generations, so estate cleanouts here often mean sorting through a full basement, attic, and garage of belongings while coordinating with a Cook County probate attorney to get the house ready for sale. Two- and three-flat buildings in neighborhoods like Logan Square and Pilsen bring extra complexity, since multiple units and shared basements can mean clearing out belongings left behind by more than one household at a time.",
      "Downsizing is common as longtime residents move from a Beverly bungalow or a Lincoln Square two-flat into a smaller condo or senior living community, needing help separating what to keep from decades of accumulated belongings. Families are frequently coordinating from out of state, and Chicago's harsh winters add pressure to get a cleanout finished before a home sits vacant and exposed to frozen pipes. Estate cleanout crews familiar with Cook County probate timelines, elevator scheduling for high-rise units, and the narrow gangways of vintage courtyard buildings can keep a listing on track without added delays.",
    ],
    priceRange: { low: 1500, high: 5500, unit: 'per full home', note: 'Multi-unit two- and three-flats run toward the higher end due to added units and shared basement storage.' },
    faqs: [
      { q: 'How much does an estate cleanout cost in Chicago, IL?', a: 'Full-home cleanouts typically run $1,500–$5,500, with multi-unit two- and three-flats running higher due to added units and shared basement storage.' },
      { q: 'Do estate cleanout companies work with Cook County probate attorneys?', a: 'Yes — established Chicago companies regularly coordinate with attorneys, executors, and realtors managing Cook County probate and closing timelines.' },
      { q: 'Can a cleanout crew handle a Chicago two-flat or three-flat with multiple units?', a: "Yes — crews experienced with Chicago's building stock can clear multiple units and shared basement storage as part of one job." },
      { q: 'Will an estate cleanout crew work around winter weather in Chicago?', a: 'Reputable companies plan around snow and ice, and can prioritize jobs where frozen pipes or a vacant property are a concern.' },
    ],
  },

  [key('junk_removal', 'IN', 'indianapolis')]: {
    intro: [
      "Indianapolis' mix of historic neighborhoods and sprawling suburbs keeps junk removal crews busy with very different jobs across the city. In Irvington, one of the city's oldest neighborhoods, Victorian-era homes generate steady renovation debris as owners update century-old kitchens and finish long-neglected basements, while bungalows in Broad Ripple and Meridian-Kessler need garage and attic cleanouts after years of accumulated belongings. Near the Indianapolis Motor Speedway in Speedway, seasonal cleanouts pick up around race weekends each May, when rental properties turn over fast for race fans and crews need quick, reliable pickups.",
      "Apartment and rental turnover is constant near downtown and Fountain Square, where landlords rely on bulk pickups to get units ready between tenants, and the city's role as a Midwest logistics and distribution hub means commercial cleanouts are common after a warehouse or office space changes hands. Storm damage is a factor too — Indiana's spring tornado and hail season regularly leaves homeowners in Mapleton-Fall Creek and other older neighborhoods hauling out water-damaged furniture and drywall. Same-day and next-day service matters most during the busy summer moving season, when apartment complexes across the metro turn over dozens of units at once.",
    ],
    priceRange: { low: 100, high: 500, unit: 'per load', note: 'Larger loads like garage or basement cleanouts run toward the higher end.' },
    faqs: [
      { q: 'How much does junk removal cost in Indianapolis, IN?', a: 'Typical loads run $100–$500, depending on volume and how far items need to be carried to the truck.' },
      { q: 'Can I get junk removal near the Indianapolis Motor Speedway during race weekend?', a: 'Yes, though it’s worth booking ahead since crews get busy with rental turnovers around May race weekends.' },
      { q: 'Do Indianapolis junk removal companies take storm-damaged debris?', a: 'Most do, including water-damaged furniture and drywall after spring storms — check with the company about weight limits for large loads.' },
      { q: 'How quickly can I book junk removal in Indianapolis?', a: 'Same-day or next-day appointments are common outside the busiest summer apartment turnover season.' },
    ],
  },
  [key('estate_cleanout', 'IN', 'indianapolis')]: {
    intro: [
      "Indianapolis' historic Irvington neighborhood, with its Victorian and Arts and Crafts homes, is home to many families who've owned the same house for generations, so an estate cleanout there often means working through a full attic and basement of belongings while coordinating with a Marion County probate attorney to get the home ready for market. Meridian-Kessler and Broad Ripple see similar work, as longtime owners of mid-century homes pass belongings down or sell after decades in the same house, and crews sort through furniture, tools, and keepsakes room by room.",
      "Downsizing is common too, as older residents move from a Meridian-Kessler or Butler-Tarkington home into a smaller property or senior living community closer to family, often near the city's northside suburbs like Carmel or Fishers. Families coordinating an estate from out of state lean on local companies that can manage the full process — sorting, donating, and hauling — without much back-and-forth. Indianapolis estate cleanout crews familiar with Marion County Superior Court probate timelines can help a family meet a tight closing date, especially when a realtor needs the house listing-ready within days rather than weeks.",
    ],
    priceRange: { low: 1200, high: 4000, unit: 'per full home', note: 'Final cost depends on home size, volume of belongings, and whether donation or resale sorting is included.' },
    faqs: [
      { q: 'How much does an estate cleanout cost in Indianapolis, IN?', a: 'Full-home cleanouts typically run $1,200–$4,000, depending on home size and how much sorting or donation is involved.' },
      { q: 'Do estate cleanout companies work with Marion County probate timelines?', a: 'Yes — established Indianapolis companies regularly coordinate with attorneys, executors, and realtors managing Marion County Superior Court probate proceedings.' },
      { q: 'Can an out-of-state family manage an Indianapolis estate cleanout remotely?', a: 'Yes — most companies are used to working with out-of-state families, coordinating access and updates remotely.' },
      { q: 'Will an estate cleanout crew set aside sentimental items in Indianapolis?', a: 'Reputable companies flag valuables, documents, and sentimental items for family review before anything is removed.' },
    ],
  },
}

export function getCityContent(
  category: Category,
  stateAbbr: string,
  citySlug: string
): CityContent | null {
  return CITY_CONTENT[key(category, stateAbbr, citySlug)] ?? null
}
