import { GlobalStyle } from '@lib/ui/css/GlobalStyle'
import { DarkLightThemeProvider } from '@lib/ui/theme/DarkLightThemeProvider'
import { Inter } from 'next/font/google'

import type { AppProps } from 'next/app'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'],
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DarkLightThemeProvider value={'light'}>
      <GlobalStyle fontFamily={inter.style.fontFamily} />
      <Component {...pageProps} />
    </DarkLightThemeProvider>
  )
}

export default MyApp
