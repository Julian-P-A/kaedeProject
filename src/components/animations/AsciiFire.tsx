import { ASCII_MEDIA } from '#/data/ascii'
import { AsciiVideo } from './AsciiVideo'

export function AsciiFire({ className }: { className?: string }) {
  return <div className={className} aria-hidden="true"><AsciiVideo asset={ASCII_MEDIA.fire} className="h-full w-full" fit="cover" /></div>
}
