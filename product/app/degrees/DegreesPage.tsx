import { VStack, HStack } from '@lib/ui/css/stack'
import { Button } from '@lib/ui/buttons/Button'
import { chromaticNotesNames, chromaticNotesNumber } from '@product/core/note'
import { getScaleNotes } from '@product/core/scale/getScaleNotes'
import { scalePatterns } from '@product/core/scale/ScaleType'
import { tonalityNames } from '@product/core/tonality'
import { useState } from 'react'
import styled from 'styled-components'

import { PageContainer } from '../layout/PageContainer'
import { PageTitle } from '../ui/PageTitle'

import { DegreesManager } from './DegreesManager'
import { DegreesFretboard } from './DegreesFretboard'
import { PrintStyles } from './PrintStyles'
import {
  DegreesProvider,
  DegreesState,
  getDegreeKey,
  getDegreeName,
} from './state/degrees'

const PrintTitle = styled.div`
  display: none;
`

const PrintLegend = styled.div`
  display: none;
`

const defaultState: DegreesState = {
  rootNote: 5,
  tonality: 'major',
  selectedDegrees: [
    { degree: 0, flat: false },
    { degree: 2, flat: false },
    { degree: 6, flat: false },
  ],
  rootOnAllStrings: false,
}

export const DegreesPage = () => {
  const [state, setState] = useState<DegreesState>(defaultState)
  const { rootNote, tonality, selectedDegrees } = state

  const pattern = scalePatterns.full[tonality]
  const scaleNotes = getScaleNotes({ pattern, rootNote })

  const getNoteForSelection = (sel: { degree: number; flat: boolean }) => {
    const natural = scaleNotes[sel.degree]
    return sel.flat
      ? (natural - 1 + chromaticNotesNumber) % chromaticNotesNumber
      : natural
  }

  const titleParts = selectedDegrees.map(
    (sel) =>
      `${getDegreeName(sel)} (${chromaticNotesNames[getNoteForSelection(sel)]})`,
  )

  const printTitle = `${chromaticNotesNames[rootNote]} ${tonalityNames[tonality]} — ${titleParts.join(', ')}`

  return (
    <DegreesProvider value={state}>
      <PrintStyles />
      <PageContainer>
        <VStack gap={60}>
          <VStack gap={40} alignItems="center" data-print-hide>
            <PageTitle>Scale Degree Explorer</PageTitle>
            <DegreesManager value={state} onChange={setState} />
          </VStack>
          <div id="degrees-print-area">
            <PrintTitle id="degrees-print-title">{printTitle}</PrintTitle>
            <DegreesFretboard />
            <PrintLegend id="degrees-print-legend">
              {selectedDegrees.map((sel) => {
                const isRoot = sel.degree === 0 && !sel.flat
                return (
                  <div key={getDegreeKey(sel)} className="print-legend-item">
                    <div
                      className="print-legend-swatch"
                      data-root={isRoot ? 'true' : 'false'}
                    />
                    <span>
                      {getDegreeName(sel)} —{' '}
                      {chromaticNotesNames[getNoteForSelection(sel)]}
                    </span>
                  </div>
                )
              })}
            </PrintLegend>
          </div>
          {selectedDegrees.length > 0 && (
            <HStack justifyContent="center" data-print-hide>
              <Button
                kind="outlined"
                onClick={() => window.print()}
                size="l"
              >
                Print Fretboard
              </Button>
            </HStack>
          )}
        </VStack>
      </PageContainer>
    </DegreesProvider>
  )
}
