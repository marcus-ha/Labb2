import React, { useEffect } from 'react'; // Importera useEffect
import { View, Text, StyleSheet } from 'react-native'; // Button är borttagen
import GlobalStyles from '../styles/GlobalStyles';

export default function SessionCompleteScreen({ navigation }) {

    // Använd useEffect för att navigera automatiskt
    useEffect(() => {
        // Skicka tillbaka användaren till startskärmen ("Hem") efter 3 sekunder
        const timer = setTimeout(() => {
            navigation.popToTop();
        }, 5000); // 3000 millisekunder = 3 sekunder

        // Rensningsfunktion: rensar timern om komponenten avlastas tidigt (även om det är osannolikt här)
        return () => clearTimeout(timer);
    }, [navigation]); // Beroendelista inkluderar navigation

    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.titleText}>Grattis!</Text>
            <Text style={GlobalStyles.messageText}>Din Pomodoro-session är klar!</Text>
            <Text style={styles.autoNavigateText}>Återgår till Huvudmenyn om 5 sekunder...</Text>
            {/* Knappen är borttagen! */}
        </View>
    );
}

// Lägg till en enkel stil för det nya meddelandet
const styles = StyleSheet.create({
    autoNavigateText: {
        fontSize: 16,
        color: '#888',
        marginTop: 40,
        textAlign: 'center',
    },
});