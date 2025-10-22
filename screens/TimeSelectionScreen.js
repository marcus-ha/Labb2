import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';

export default function TimeSelectionScreen({ navigation }) {
    const [timeInput, setTimeInput] = useState('');

    // Funktion för att starta det 60-minuters programmet
    const handleStart60MinProgram = () => {
        navigation.navigate('MusicSelection', { program: 'customProgram60' });
    };

    // Funktion för att starta det 120-minuters programmet
    const handleStart120MinProgram = () => {
        navigation.navigate('MusicSelection', { program: 'customProgram120' });
    };

    // Funktion för att starta timern med egen inmatning
    const handleStartCustomTimer = () => {
        const minutes = parseInt(timeInput);

        if (isNaN(minutes) || minutes <= 0) {
            Alert.alert('Ogiltig inmatning', 'Vänligen ange ett giltigt antal minuter.');
            return;
        }

        const totalSeconds = minutes * 60;
        navigation.navigate('Timer', { initialTime: totalSeconds });
    };

    return (
        <View style={GlobalStyles.container}>
            {/* Knapp för det 60-minuters programmet */}
            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>60-minuters session - Kort Demo!</Text>
                <Button
                    title="Starta 60 min"
                    onPress={handleStart60MinProgram}
                />
            </View>

            <View style={styles.divider} />

            {/* Knapp för det 120-minuters programmet */}
            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>120-minuters session</Text>
                <Button
                    title="Starta 120 min"
                    onPress={handleStart120MinProgram}
                />
            </View>

            <View style={styles.divider} />

            {/* Inmatning för eget val */}
            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>Eller ange egen tid:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setTimeInput(text)}
                    value={timeInput}
                    keyboardType="numeric"
                    placeholder="t.ex. 25"
                />
                <Button
                    title="Starta egen tid"
                    onPress={handleStartCustomTimer}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    optionContainer: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    optionText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    input: {
        height: 40,
        width: '60%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: '#fff',
    },
    divider: {
        height: 1,
        width: '80%',
        backgroundColor: '#ccc',
        marginVertical: 20,
    },
});