import { getColor } from '@lib/ui/theme/getters'
import { getIntervalCenter } from '@lib/utils/interval/getIntervalCenter'
import { toPercents } from '@lib/utils/toPercents'
import { getFretPosition } from '@product/core/guitar/getFretPosition'
import styled from 'styled-components'

import { totalFrets } from '../config'

import { useVisibleFrets } from './state/visibleFrets'

const Container = styled.div`
  display: flex;
  position: relative;
  height: 24px;
`

const Number = styled.span`
  position: absolute;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 500;
  color: ${getColor('textSupporting')};
`

export const FretNumbers = () => {
  const visibleFrets = useVisibleFrets()

  const startFret = Math.max(visibleFrets.start, 0)
  const frets: number[] = []
  for (let i = startFret; i <= visibleFrets.end; i++) {
    frets.push(i)
  }

  return (
    <Container>
      {frets.map((index) => {
        const position = getFretPosition({
          index,
          visibleFrets,
          totalFrets,
        })
        const center = getIntervalCenter(position)

        return (
          <Number key={index} style={{ left: toPercents(center) }}>
            {index + 1}
          </Number>
        )
      })}
    </Container>
  )
}
