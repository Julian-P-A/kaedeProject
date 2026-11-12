/** Photo and its exported ASCII layer share the same native image crop. */
export function AsciiPhoto({ src, alt, position = 0.5 }: { src: string; alt: string; position?: number }) {
  const objectPosition = position * 100 + '% 50%'
  const rendered = '/ascii/rendered/process-' + src.split('/').pop()
  return (
    <div className="ascii-photo">
      <img className="ascii-photo-source" src={src} alt={alt} width={1280} height={1440} loading="lazy" decoding="async" style={{ objectPosition }} />
      <img className="ascii-photo-render" src={rendered} alt="" aria-hidden="true" width={1920} height={2160} loading="lazy" decoding="async" style={{ objectPosition }} />
    </div>
  )
}
