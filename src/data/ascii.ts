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
  creation: clip('creation', 1440, 810, 720, 406),
  web: clip('web-architecture', 720, 720, 360, 360),
  ai: clip('ai-bust', 720, 720, 360, 360),
  automation: clip('automation-gears', 720, 720, 360, 360),
  crm: clip('crm-hands', 720, 408, 360, 204),
  book: clip('faq-book', 720, 544, 480, 362),
  fire: { src: '/ascii/rendered/fire', width: 1440, height: 180, fps: 12 } satisfies AsciiAsset,
  field: { src: '/ascii/rendered/field', width: 720, height: 360, fps: 12 } satisfies AsciiAsset,
}
