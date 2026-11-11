import { ASCII_MEDIA } from '#/data/ascii'
import { AsciiVideo } from './AsciiVideo'

export function AsciiField({ className, seed = 0 }: { className?: string; seed?: number }) {
  return <div className={className} aria-hidden="true"><AsciiVideo asset={ASCII_MEDIA.field} className="h-full w-full opacity-[0.09]" speed={1 + seed * 0.03} fit="cover" /></div>
}
