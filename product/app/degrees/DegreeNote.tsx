import { centerContent } from '@lib/ui/css/centerContent'
import { round } from '@lib/ui/css/round'
import { sameDimensions } from '@lib/ui/css/sameDimensions'
import { toSizeUnit } from '@lib/ui/css/toSizeUnit'
import { HSLA } from '@lib/ui/colors/HSLA'
import { PositionAbsolutelyByCenter } from '@lib/ui/layout/PositionAbsolutelyByCenter'
import { toPercents } from '@lib/utils/toPercents'
import { getFretPosition } from '@product/core/guitar/getFretPosition'
import { getNoteFromPosition } from '@product/core/note/getNoteFromPosition'
import { NotePosition } from '@product/core/note/NotePosition'
import { getDegreeNoteName } from '@product/core/note/spelledNote'
import styled, { css } from 'styled-components'

import { totalFrets } from '../guitar/config'
import { fretboardConfig } from '../guitar/fretboard/config'
import { useVisibleFrets } from '../guitar/fretboard/state/visibleFrets'
import { getStringPosition } from '../guitar/fretboard/utils/getStringPosition'

import { NoteText } from './NoteText'
import {
  DegreeSelection,
  degreeHues,
  getDegreeName,
  useDegrees,
} from './state/degrees'

type DegreeNoteProps = NotePosition & {
  selection: DegreeSelection
}

const Container = styled.div<{
  $isRoot: boolean
  $hue: number
}>`
  ${round}
  ${sameDimensions(fretboardConfig.noteSize)}
  ${centerContent};
  font-weight: 600;
  font-size: 11px;
  flex-direction: column;
  line-height: 1;
  gap: 1px;

  ${({ $isRoot, $hue, theme: { name: themeName } }) => {
    const color = new HSLA($hue, 70, themeName === 'light' ? 42 : 52)

    if ($isRoot) {
      return css`
        background: ${color.toCssValue()};
        color: white;
      `
    }

    if (themeName === 'light') {
      return css`
        border: 2px solid ${color.getVariant({ l: (l) => l * 0.7 }).toCssValue()};
        background: ${color.getVariant({ l: () => 93, s: (s) => s * 0.35 }).toCssValue()};
        color: ${color.getVariant({ l: (l) => l * 0.5 }).toCssValue()};
      `
    }

    return css`
      border: 2px solid ${color.getVariant({ l: (l) => l * 0.6 }).toCssValue()};
      background: ${color.getVariant({ l: () => 10, s: (s) => s * 0.3 }).toCssValue()};
      color: ${color.getVariant({ l: (l) => l * 1.4 }).toCssValue()};
    `
  }}
`

const DegreeBadge = styled.span`
  font-size: 9px;
  opacity: 0.8;
`

export const DegreeNote = ({ string, fret, selection }: DegreeNoteProps) => {
  const visibleFrets = useVisibleFrets()
  const { rootNote, tonality } = useDegrees()

  const top = toPercents(getStringPosition(string))
  const value = getNoteFromPosition({ position: { string, fret } })
  const spelledName = getDegreeNoteName({
    rootNote,
    tonality,
    degreeIndex: selection.degree,
    noteSemitone: value,
  })

  const left = `calc(${
    fret === -1
      ? toSizeUnit(-fretboardConfig.nutWidth)
      : toPercents(
          getFretPosition({ totalFrets, visibleFrets, index: fret }).end,
        )
  } - ${toSizeUnit(fretboardConfig.noteSize / 2 + fretboardConfig.noteFretOffset)})`

  const isRoot = selection.degree === 0 && !selection.flat

  return (
    <PositionAbsolutelyByCenter top={top} left={left}>
      <Container
        className="degree-note"
        data-degree={isRoot ? '0' : '1'}
        $isRoot={isRoot}
        $hue={degreeHues[selection.degree]}
      >
        <span>
          <NoteText>{spelledName}</NoteText>
        </span>
        <DegreeBadge>
          <NoteText>{getDegreeName(selection)}</NoteText>
        </DegreeBadge>
      </Container>
    </PositionAbsolutelyByCenter>
  )
}
