import { hStack } from '@lib/ui/css/stack'
import { toSizeUnit } from '@lib/ui/css/toSizeUnit'
import { ChildrenProp } from '@lib/ui/props'
import { getColor } from '@lib/ui/theme/getters'
import { range } from '@lib/utils/array/range'
import { Interval } from '@lib/utils/interval/Interval'
import { intervalRange } from '@lib/utils/interval/intervalRange'
import { getFretMarkers } from '@product/core/guitar/fretMarkers'
import { standardTuning } from '@product/core/guitar/tuning'
import styled from 'styled-components'

import { fretboardConfig } from './config'
import { Fret } from './Fret'
import { FretMarkerItem } from './FretMarkerItem'
import { FretNumbers } from './FretNumbers'
import { Nut } from './Nut'
import { VisibleFretsProvider } from './state/visibleFrets'
import { String } from './String'

const Wrapper = styled.div``

const Neck = styled.div`
  height: ${toSizeUnit(fretboardConfig.height)};
  position: relative;

  ${hStack()};
`

const OpenNotes = styled.div`
  width: ${toSizeUnit(fretboardConfig.openNotesSectionWidth)};
`

const Frets = styled.div`
  position: relative;
  flex: 1;
  background: ${getColor('foreground')};
`

const NumbersRow = styled.div`
  ${hStack()};
`

const NumbersSpacer = styled.div`
  width: ${toSizeUnit(
    fretboardConfig.openNotesSectionWidth + fretboardConfig.nutWidth,
  )};
  flex-shrink: 0;
`

const NumbersContainer = styled.div`
  flex: 1;
  position: relative;
`

type FretboardProps = {
  visibleFrets?: Interval
} & ChildrenProp

export const defaultVisibleFrets: Interval = { start: -1, end: 14 }

export const Fretboard = ({
  children,
  visibleFrets = defaultVisibleFrets,
}: FretboardProps) => {
  const showNut = visibleFrets.start < 1
  const showOpenNotes = visibleFrets.start < 0

  const frets = intervalRange(
    showNut
      ? {
          ...visibleFrets,
          start: visibleFrets.start + 1,
        }
      : visibleFrets,
  )

  return (
    <VisibleFretsProvider value={visibleFrets}>
      <Wrapper>
        <NumbersRow>
          {(showOpenNotes || showNut) && <NumbersSpacer />}
          <NumbersContainer>
            <FretNumbers />
          </NumbersContainer>
        </NumbersRow>
        <Neck>
          {showOpenNotes && <OpenNotes />}
          {showNut && <Nut />}
          <Frets>
            {frets.map((index) => (
              <Fret key={index} index={index} />
            ))}
            {getFretMarkers(visibleFrets).map((value) => (
              <FretMarkerItem key={value.index} value={value} />
            ))}

            {range(standardTuning.length).map((index) => (
              <String key={index} index={index} />
            ))}
            {children}
          </Frets>
        </Neck>
      </Wrapper>
    </VisibleFretsProvider>
  )
}
