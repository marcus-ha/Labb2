import React from 'react';
import { View, Text, Button } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';

export default function HomeScreen({ navigation }) {
    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.titleText}>Välkommen till Pomodoro-appen!</Text>
            <View style={{ width: '80%', marginVertical: 10 }}>
                <Button
                    title="Starta en Pomodoro-session"
                    onPress={() => navigation.navigate('Tidsval')}
                />
            </View>
            <View style={{ width: '80%', marginVertical: 10 }}>
                <Button
                    title="Visa sessionslogg"
                    onPress={() => navigation.navigate('Logg')}
                    color="green"
                />
            </View>
        </View>
    );
}