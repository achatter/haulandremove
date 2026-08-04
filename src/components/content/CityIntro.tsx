interface CityIntroProps {
  paragraphs: string[]
}

export function CityIntro({ paragraphs }: CityIntroProps) {
  return (
    <div className="space-y-3 text-muted-foreground mb-4">
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  )
}
