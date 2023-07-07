import tw from 'twrnc'

import { Screen } from '../components/Screen'

export const IFRAME_ORIGIN = 'http://localhost:9000'

export function HomeScreen() {
  return (
    <Screen>
      <iframe
        allow={`fullscreen;clipboard-write ${IFRAME_ORIGIN}`}
        // sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
        src={IFRAME_ORIGIN}
        style={tw`border-0 w-full h-full`}
      />
    </Screen>
  )
}
