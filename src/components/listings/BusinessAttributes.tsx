interface BusinessAttributesProps {
  description: string | null | undefined
}

type AttributeCategory = Record<string, boolean>
type AttributesData = Record<string, AttributeCategory>

function parseAttributes(description: string): AttributesData | null {
  try {
    const parsed = JSON.parse(description)
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as AttributesData
    }
    return null
  } catch {
    return null
  }
}

// Extract service highlights from text description
function extractServiceHighlights(description: string): string[] {
  const highlights: string[] = []
  
  // Common service highlight patterns
  const patterns = [
    /same[- ]day|next[- ]day/i,
    /24\/7|24-7|24 hour|twenty four hour/i,
    /residential|commercial|real estate/i,
    /insured|licensed|bonded/i,
    /free estimate/i,
    /eco[- ]friendly|environmentally friendly|green/i,
    /locally owned|local/i,
    /trusted|professional|reliable/i,
    /fast|quick|rapid/i,
    /affordable|competitive|fair pricing/i
  ]
  
  patterns.forEach(pattern => {
    const match = description.match(pattern)
    if (match) {
      // Clean up and format the highlight
      let highlight = match[0]
      if (highlight.toLowerCase().includes('same') || highlight.toLowerCase().includes('next')) {
        highlight = 'Same-Day or Next-Day Service'
      } else if (highlight.toLowerCase().includes('24')) {
        highlight = '24/7 Customer Support'
      } else if (highlight.toLowerCase().includes('residential')) {
        highlight = 'Residential, Commercial & Real Estate Services'
      } else if (highlight.toLowerCase().includes('local')) {
        highlight = 'Locally Owned & Trusted'
      }
      
      if (!highlights.some(h => h.toLowerCase().includes(highlight.toLowerCase().split(' ')[0]))) {
        highlights.push(highlight)
      }
    }
  })
  
  return highlights
}

// Format description into structured sections
function formatDescription(description: string): { 
  mainDescription: string
  highlights: string[]
  details?: string
} {
  // Split by periods or line breaks to find sections
  const sentences = description.split(/[.\n]+/).filter(s => s.trim().length > 0)
  
  // Extract service highlights
  const highlights = extractServiceHighlights(description)
  
  // Find main company description (usually the first substantial sentence)
  const mainDescription = sentences.find(s => s.trim().length > 50) || sentences[0] || description
  
  // Find additional details (longer sentences that aren't the main description)
  const details = sentences
    .filter(s => s.trim().length > 30 && s !== mainDescription)
    .join('. ')
  
  return {
    mainDescription: mainDescription.trim(),
    highlights,
    details: details ? details.trim() : undefined
  }
}

export function BusinessAttributes({ description }: BusinessAttributesProps) {
  if (!description) return null

  const attributes = parseAttributes(description)

  if (!attributes) {
    // Handle rich text description
    const formatted = formatDescription(description)
    
    return (
      <div className="space-y-4">
        {/* Main Description */}
        <div>
          <p className="text-foreground leading-relaxed">{formatted.mainDescription}</p>
        </div>
        
        {/* Service Highlights */}
        {formatted.highlights.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Service Highlights</h3>
            <ul className="space-y-2">
              {formatted.highlights.map((highlight, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <span className="text-green-600" aria-hidden="true">✓</span>
                  <span className="text-foreground font-medium">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Additional Details */}
        {formatted.details && (
          <div>
            <p className="text-muted-foreground leading-relaxed text-sm">{formatted.details}</p>
          </div>
        )}
      </div>
    )
  }

  // Handle structured JSON data (existing functionality)
  return (
    <div className="space-y-4">
      {Object.entries(attributes).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-foreground mb-2">{category}</h3>
          <ul className="space-y-1">
            {Object.entries(items).map(([label, value]) => (
              <li key={label} className="flex items-center gap-2 text-sm">
                {value ? (
                  <span className="text-green-600" aria-hidden="true">✓</span>
                ) : (
                  <span className="text-muted-foreground" aria-hidden="true">✗</span>
                )}
                <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
