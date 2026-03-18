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

export function BusinessAttributes({ description }: BusinessAttributesProps) {
  if (!description) return null

  const attributes = parseAttributes(description)

  if (!attributes) {
    return <p className="text-muted-foreground leading-relaxed">{description}</p>
  }

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
