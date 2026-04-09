import { range } from '@lib/utils/array/range'
import { intervalRange } from '@lib/utils/interval/intervalRange'
import { standardTuning } from '@product/core/guitar/tuning'
import { chromaticNotesNumber } from '@product/core/note'
import { getScaleNotes } from '@product/core/scale/getScaleNotes'
import { scalePatterns } from '@product/core/scale/ScaleType'

import { defaultVisibleFrets, Fretboard } from '../guitar/fretboard/Fretboard'

import { DegreeNote } from './DegreeNote'
import { DegreeSelection, useDegrees } from './state/degrees'

// User counts: string 1=low E (code 5), string 2=A (code 4)
// Hide root on strings 3-6 (G, D, B, high E) = code indices 0, 1, 2, 3
const upperStringIndices = new Set([0, 1, 2, 3])

export const DegreesFretboard = () => {
  const { rootNote, tonality, selectedDegrees, rootOnAllStrings } = useDegrees()

  const pattern = scalePatterns.full[tonality]
  const scaleNotes = getScaleNotes({ pattern, rootNote })

  const selectedNotes = selectedDegrees.map((sel) => {
    const natural = scaleNotes[sel.degree]
    const note = sel.flat
      ? (natural - 1 + chromaticNotesNumber) % chromaticNotesNumber
      : natural
    return { note, selection: sel }
  })

  return (
    <div id="degrees-fretboard">
      <Fretboard>
        {range(standardTuning.length).map((string) => {
          const openNote = standardTuning[string]
          return intervalRange(defaultVisibleFrets).map((fret) => {
            const note = (openNote + fret + 1) % chromaticNotesNumber

            const match = selectedNotes.find((sn) => sn.note === note)
            if (!match) return null

            const isRoot = match.selection.degree === 0 && !match.selection.flat
            if (isRoot && !rootOnAllStrings && upperStringIndices.has(string)) {
              return null
            }

            return (
              <DegreeNote
                key={`${string}-${fret}`}
                string={string}
                fret={fret}
                selection={match.selection}
              />
            )
          })
        })}
      </Fretboard>
    </div>
  )
}
