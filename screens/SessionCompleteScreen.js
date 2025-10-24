import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';

export default function SessionCompleteScreen({ navigation }) {

    // Använd useEffect för att navigera automatiskt
    useEffect(() => {
        // Skicka tillbaka användaren till startskärmen ("Hem") efter 5 sekunder
        const timer = setTimeout(() => {
            navigation.popToTop();
        }, 5000);

        // Rensar timern om komponenten avlastas tidigt
        return () => clearTimeout(timer);
    }, [navigation]); // Beroendelista inkluderar navigation

    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.titleText}>Grattis!</Text>
            <Text style={GlobalStyles.messageText}>Din Pomodoro-session är klar!</Text>
            <Text style={styles.autoNavigateText}>Återgår till Huvudmenyn om 5 sekunder...</Text>
        </View>
    );
}

// Ska flyttas till GLobalStyles.js senare
const styles = StyleSheet.create({
    autoNavigateText: {
        fontSize: 16,
        color: '#888',
        marginTop: 40,
        textAlign: 'center',
    },
});