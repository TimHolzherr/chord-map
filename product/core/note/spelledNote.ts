import { Tonality } from '../tonality'

import { chromaticNotesNumber } from '.'

const letterOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const
type Letter = (typeof letterOrder)[number]

const letterSemitones: Record<Letter, number> = {
  A: 0,
  B: 2,
  C: 3,
  D: 5,
  E: 7,
  F: 8,
  G: 10,
}

// Preferred root spelling per chromatic index (matches chromaticNotesNames
// order: A, A#, B, C, C#, D, D#, E, F, F#, G, G#). Choices follow the
// standard circle-of-fifths convention for each mode — e.g. Eb major (3
// flats) is preferred over D# major, and C# minor (4 sharps) over Db minor.
const rootNoteSpelling: Record<Tonality, string[]> = {
  major: ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab'],
  minor: ['A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#'],
}

export const getRootNoteName = (rootNote: number, tonality: Tonality): string =>
  rootNoteSpelling[tonality][rootNote]

const parseRootLetter = (name: string): Letter => name[0] as Letter

const formatAccidental = (diff: number): string => {
  let d = diff
  while (d > 6) d -= chromaticNotesNumber
  while (d < -6) d += chromaticNotesNumber
  if (d === 0) return ''
  return d > 0 ? '#'.repeat(d) : 'b'.repeat(-d)
}

type DegreeNoteNameInput = {
  rootNote: number
  tonality: Tonality
  degreeIndex: number
  noteSemitone: number
}

// Spell a scale-degree note so that letter names don't repeat within the
// diatonic frame and chromatic alterations keep the parent letter (a
// lowered 3rd in C is Eb, not D#).
export const getDegreeNoteName = ({
  rootNote,
  tonality,
  degreeIndex,
  noteSemitone,
}: DegreeNoteNameInput): string => {
  const rootName = getRootNoteName(rootNote, tonality)
  const rootLetter = parseRootLetter(rootName)
  const rootLetterIdx = letterOrder.indexOf(rootLetter)

  const letter = letterOrder[(rootLetterIdx + degreeIndex) % letterOrder.length]
  const diff = noteSemitone - letterSemitones[letter]
  return `${letter}${formatAccidental(diff)}`
}
