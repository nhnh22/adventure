import { Inter_900Black, useFonts } from '@expo-google-fonts/dev'
import { registerRootComponent } from 'expo'
import { ActivityIndicator, View } from 'react-native'

import { HomeScreen } from './screens/HomeScreen'

function App() {
  let [fontsLoaded] = useFonts({
    Inter_900Black,
  })

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return <HomeScreen />
}

export default registerRootComponent(App)
