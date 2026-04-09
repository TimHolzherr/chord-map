import { createGlobalStyle } from 'styled-components'

export const PrintStyles = createGlobalStyle`
  @media print {
    @page {
      size: landscape;
      margin: 0.4in;
    }

    body {
      background: white !important;
      color: black !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Hide selectors, nav, footer, print button */
    [data-print-hide] {
      display: none !important;
    }

    /* Hide everything that isn't an ancestor of the fretboard */
    #__next * {
      overflow: visible !important;
    }

    /* Hide nav header and footer — they are siblings of the content area */
    #__next > * > * > *:first-child {
      display: none !important;
    }
    #__next footer {
      display: none !important;
    }

    #degrees-print-area {
      width: 100% !important;
      max-width: 100% !important;
    }

    #degrees-fretboard {
      width: 100%;
    }

    /* B&W friendly note styling */
    .degree-note {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Root: solid black with white text */
    .degree-note[data-degree="0"] {
      background: #000 !important;
      color: #fff !important;
      border-color: #000 !important;
    }

    /* Non-root degrees: white with black border */
    .degree-note:not([data-degree="0"]) {
      background: #fff !important;
      color: #000 !important;
      border: 2.5px solid #000 !important;
    }

    /* Print title */
    #degrees-print-title {
      display: block !important;
      font-size: 14pt;
      font-weight: 700;
      margin-bottom: 8pt;
      color: black;
    }

    /* Print legend */
    #degrees-print-legend {
      display: flex !important;
      flex-wrap: wrap;
      gap: 12pt;
      margin-top: 10pt;
      font-size: 10pt;
      color: black;
    }

    .print-legend-item {
      display: flex;
      align-items: center;
      gap: 4pt;
    }

    .print-legend-swatch {
      width: 12pt;
      height: 12pt;
      border-radius: 50%;
      border: 2px solid #000;
      flex-shrink: 0;
    }

    .print-legend-swatch[data-root="true"] {
      background: #000 !important;
    }

    .print-legend-swatch[data-root="false"] {
      background: #fff !important;
    }
  }
`
