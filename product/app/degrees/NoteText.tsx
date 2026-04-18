import { ReactNode } from 'react'
import styled from 'styled-components'

// Font stack that reliably contains U+266D / U+266F so the browser does not
// fall back to a symbol font with looser metrics (which is what causes the
// extra gap before ♭). The negative margin nudges the glyph closer to the
// preceding letter to match the visual weight of a sharp in text fonts.
const Accidental = styled.span`
  font-family: 'Lucida Grande', 'Arial Unicode MS', 'DejaVu Sans', Arial,
    sans-serif;
  margin-left: -0.08em;
`

// Inline-block so this renders as a single flex item when placed inside a
// flex container with `gap` (e.g. DegreeButton) — otherwise the text and
// accidental span become separate flex items and the gap pushes them apart.
const Wrapper = styled.span`
  display: inline-block;
`

const accidentalGlyph = (ch: '#' | 'b') => (ch === '#' ? '\u266F' : '\u266D')

export const NoteText = ({ children }: { children: string }) => {
  const parts: ReactNode[] = []
  let buf = ''
  let key = 0

  for (const ch of children) {
    if (ch === '#' || ch === 'b') {
      if (buf) {
        parts.push(buf)
        buf = ''
      }
      parts.push(
        <Accidental key={key++}>{accidentalGlyph(ch)}</Accidental>,
      )
    } else {
      buf += ch
    }
  }
  if (buf) parts.push(buf)

  return <Wrapper>{parts}</Wrapper>
}
