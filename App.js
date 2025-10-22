import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import TimeSelectionScreen from './screens/TimeSelectionScreen';
import TimerScreen from './screens/TimerScreen';
import SessionCompleteScreen from './screens/SessionCompleteScreen';
import SessionLogScreen from './screens/SessionLogScreen';
import PreparationScreen from './screens/PreparationScreen';
import MusicSelectionScreen from './screens/MusicSelectionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Hem">
        <Stack.Screen name="Hem" component={HomeScreen} options={{ title: 'Huvudmeny' }} />
        <Stack.Screen name="Tidsval" component={TimeSelectionScreen} options={{ title: 'Välj tid' }} />
        <Stack.Screen name="MusicSelection" component={MusicSelectionScreen} options={{ title: 'Välj Musik' }} />
        <Stack.Screen name="Förberedelse" component={PreparationScreen} options={{ title: 'Förberedelse' }} />
        <Stack.Screen name="Timer" component={TimerScreen} options={{ title: 'Nedräknare', headerLeft: () => null }} />
        <Stack.Screen name="Avslutad" component={SessionCompleteScreen} options={{ title: 'Session completed', headerLeft: () => null }} />
        <Stack.Screen name="Logg" component={SessionLogScreen} options={{ title: 'Sessionslogg' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}