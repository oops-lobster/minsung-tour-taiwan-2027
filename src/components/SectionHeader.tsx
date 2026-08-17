interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  inverse?: boolean
}

export function SectionHeader({ eyebrow, title, description, inverse = false }: SectionHeaderProps) {
  return (
    <header className={`section-header ${inverse ? 'section-header--inverse' : ''}`}>
      <span className="section-header__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  )
}
