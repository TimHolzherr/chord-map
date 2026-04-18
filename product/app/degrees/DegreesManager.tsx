import { HStack, VStack } from '@lib/ui/css/stack'
import { GroupedRadioInput } from '@lib/ui/inputs/GroupedRadioInput'
import { InputContainer } from '@lib/ui/inputs/InputContainer'
import { InputLabel } from '@lib/ui/inputs/InputLabel'
import { MinimalisticToggle } from '@lib/ui/inputs/MinimalisticToggle'
import { range } from '@lib/utils/array/range'
import { HSLA } from '@lib/ui/colors/HSLA'
import { chromaticNotesNumber } from '@product/core/note'
import {
  getDegreeNoteName,
  getRootNoteName,
} from '@product/core/note/spelledNote'
import { getScaleNotes } from '@product/core/scale/getScaleNotes'
import { scalePatterns } from '@product/core/scale/ScaleType'
import { tonalityNames, tonalities } from '@product/core/tonality'
import styled, { css } from 'styled-components'
import { getColor } from '@lib/ui/theme/getters'
import { borderRadius } from '@lib/ui/css/borderRadius'
import { interactive } from '@lib/ui/css/interactive'
import { horizontalPadding } from '@lib/ui/css/horizontalPadding'

import { NoteText } from './NoteText'
import {
  DegreeSelection,
  degreeHues,
  degreeNames,
  DegreesState,
  flatDegreeIndices,
  flatDegreeNames,
  getDegreeKey,
} from './state/degrees'

type DegreesManagerProps = {
  value: DegreesState
  onChange: (value: DegreesState) => void
}

const DegreeButton = styled.button<{
  $active: boolean
  $hue: number
}>`
  ${borderRadius.s};
  ${interactive};
  ${horizontalPadding(10)};
  min-height: 36px;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;

  ${({ $active, $hue, theme: { name: themeName } }) => {
    const color = new HSLA($hue, 70, themeName === 'light' ? 42 : 52)

    if ($active) {
      if (themeName === 'light') {
        return css`
          border: 2px solid
            ${color.getVariant({ l: (l) => l * 0.7 }).toCssValue()};
          background: ${color.getVariant({ l: () => 92, s: (s) => s * 0.4 }).toCssValue()};
          color: ${color.getVariant({ l: (l) => l * 0.5 }).toCssValue()};
        `
      }
      return css`
        border: 2px solid ${color.toCssValue()};
        background: ${color.getVariant({ l: () => 14 }).toCssValue()};
        color: ${color.getVariant({ l: (l) => l * 1.4 }).toCssValue()};
      `
    }

    return css`
      border: 2px solid ${getColor('mistExtra')};
      color: ${getColor('textSupporting')};
      &:hover {
        background: ${getColor('mist')};
      }
    `
  }}
`

export const DegreesManager = ({ value, onChange }: DegreesManagerProps) => {
  const { rootNote, tonality, selectedDegrees } = value

  const pattern = scalePatterns.full[tonality]
  const scaleNotes = getScaleNotes({ pattern, rootNote })

  const isSelected = (d: DegreeSelection) =>
    selectedDegrees.some(
      (s) => s.degree === d.degree && s.flat === d.flat,
    )

  const toggleDegree = (d: DegreeSelection) => {
    const key = getDegreeKey(d)
    const exists = selectedDegrees.some((s) => getDegreeKey(s) === key)
    const next = exists
      ? selectedDegrees.filter((s) => getDegreeKey(s) !== key)
      : [...selectedDegrees, d]
    onChange({ ...value, selectedDegrees: next })
  }

  const getNoteForDegree = (d: DegreeSelection) => {
    const natural = scaleNotes[d.degree]
    return d.flat
      ? (natural - 1 + chromaticNotesNumber) % chromaticNotesNumber
      : natural
  }

  const getSpelledName = (d: DegreeSelection) =>
    getDegreeNoteName({
      rootNote,
      tonality,
      degreeIndex: d.degree,
      noteSemitone: getNoteForDegree(d),
    })

  return (
    <VStack alignItems="center">
      <VStack style={{ maxWidth: 560 }} gap={20} alignItems="start">
        <InputContainer>
          <InputLabel>
            Key: <NoteText>{getRootNoteName(rootNote, tonality)}</NoteText>
          </InputLabel>
          <GroupedRadioInput
            value={rootNote}
            onChange={(index) => onChange({ ...value, rootNote: index })}
            options={range(chromaticNotesNumber)}
            renderOption={(index) => (
              <NoteText>{getRootNoteName(index, tonality)}</NoteText>
            )}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>Tonality: {tonalityNames[tonality]}</InputLabel>
          <GroupedRadioInput
            value={tonality}
            onChange={(tonality) => onChange({ ...value, tonality })}
            options={tonalities}
            renderOption={(t) => tonalityNames[t]}
          />
        </InputContainer>
        <InputContainer as="div">
          <InputLabel>Scale degrees</InputLabel>
          <HStack gap={6} wrap="wrap">
            {range(7).map((deg) => {
              const sel: DegreeSelection = { degree: deg, flat: false }
              return (
                <DegreeButton
                  key={deg}
                  $active={isSelected(sel)}
                  $hue={degreeHues[deg]}
                  onClick={() => toggleDegree(sel)}
                >
                  <span>
                    {degreeNames[deg]} (
                    <NoteText>{getSpelledName(sel)}</NoteText>)
                  </span>
                </DegreeButton>
              )
            })}
          </HStack>
        </InputContainer>
        <MinimalisticToggle
          label="Show root on all strings"
          value={value.rootOnAllStrings}
          onChange={(rootOnAllStrings) =>
            onChange({ ...value, rootOnAllStrings })
          }
        />
        <InputContainer as="div">
          <InputLabel>Flat degrees (blues / modal)</InputLabel>
          <HStack gap={6} wrap="wrap">
            {flatDegreeIndices.map((deg) => {
              const sel: DegreeSelection = { degree: deg, flat: true }
              return (
                <DegreeButton
                  key={`b${deg}`}
                  $active={isSelected(sel)}
                  $hue={degreeHues[deg]}
                  onClick={() => toggleDegree(sel)}
                >
                  <span>
                    <NoteText>{flatDegreeNames[deg]}</NoteText> (
                    <NoteText>{getSpelledName(sel)}</NoteText>)
                  </span>
                </DegreeButton>
              )
            })}
          </HStack>
        </InputContainer>
      </VStack>
    </VStack>
  )
}
