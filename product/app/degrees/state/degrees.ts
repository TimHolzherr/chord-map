import { getValueProviderSetup } from '@lib/ui/state/getValueProviderSetup'
import { Tonality } from '@product/core/tonality'

export type DegreeSelection = {
  degree: number
  flat: boolean
}

export type DegreesState = {
  rootNote: number
  tonality: Tonality
  selectedDegrees: DegreeSelection[]
  rootOnAllStrings: boolean
}

export const { useValue: useDegrees, provider: DegreesProvider } =
  getValueProviderSetup<DegreesState>('Degrees')

export const degreeNames = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
] as const

export const flatDegreeNames = [
  '',
  'b2',
  'b3',
  'b4',
  'b5',
  'b6',
  'b7',
] as const

export const degreeHues = [130, 30, 210, 55, 270, 340, 180] as const

export const flatDegreeIndices = [1, 2, 4, 5, 6] as const

export const getDegreeKey = (d: DegreeSelection) =>
  `${d.degree}${d.flat ? 'b' : ''}`

export const getDegreeName = (d: DegreeSelection) =>
  d.flat ? flatDegreeNames[d.degree] : degreeNames[d.degree]
