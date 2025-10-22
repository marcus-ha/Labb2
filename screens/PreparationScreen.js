import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';

export default function PreparationScreen({ route, navigation }) {
    // 1. Fånga upp ALLA nödvändiga parametrar
    const { program, initialTime, selectedMusic } = route.params;

    const handleStartSession = () => {
        // 2. Skicka ALLA parametrar vidare till TimerScreen
        navigation.navigate('Timer', {
            program: program,
            initialTime: initialTime, // Viktig för Pomodoro-läget
            selectedMusic: selectedMusic // Denna fixar musikproblemet!
        });
    };

    return (
        <View style={GlobalStyles.container}>
            <Text style={styles.titleText}>Förbered dig</Text>
            <Text style={styles.descriptionText}>
                Innan vi sätter igång:
                {' \n'}- Se till att du har din dricka och dina studieböcker nära till hands.
                {' \n'}- Stäng av notiser på mobilen för att minimera störningar.
                {' \n'}- Ta några djupa andetag för att komma i rätt sinnesstämning.
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Starta sessionen"
                    onPress={handleStartSession}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    descriptionText: {
        fontSize: 18,
        textAlign: 'left',
        lineHeight: 25,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        width: '80%',
    },
});

