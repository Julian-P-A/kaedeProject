/** Final pixels exported by scripts/export-ascii.py, never luminance maps. */
export interface AsciiAsset {
  src: string
  width: number
  height: number
  fps: number
  mobile?: { src: string; width: number; height: number }
}

function clip(name: string, width: number, height: number, mobileWidth: number, mobileHeight: number): AsciiAsset {
  return {
    src: `/ascii/rendered/${name}`,
    width,
    height,
    fps: 30,
    mobile: { src: `/ascii/rendered/${name}-mobile`, width: mobileWidth, height: mobileHeight },
  }
}

export const ASCII_MEDIA = {
  creation: clip('creation', 2880, 1620, 1440, 812),
  web: clip('web-architecture', 1440, 1440, 720, 720),
  ai: clip('ai-bust', 1440, 1440, 720, 720),
  automation: clip('automation-gears', 1440, 1440, 720, 720),
  crm: clip('crm-hands', 1440, 816, 720, 408),
  book: clip('faq-book', 1440, 1088, 960, 724),
  fire: { src: '/ascii/rendered/fire', width: 2880, height: 360, fps: 12 } satisfies AsciiAsset,
  field: { src: '/ascii/rendered/field', width: 1440, height: 720, fps: 12 } satisfies AsciiAsset,
}
