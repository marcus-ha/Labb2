import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';

export default function MusicSelectionScreen({ route, navigation }) {
    // Tar emot programmet och initialTime från startskärmen
    const { program, initialTime } = route.params;

    const musicOptions = [
        { name: 'Strand (Beach)', key: 'beach' },
        { name: 'Regn (Rain)', key: 'rain' },
    ];

    const handleMusicSelect = (selectedMusicKey) => {
        navigation.navigate('Förberedelse', {
            program: program,
            initialTime: initialTime,
            selectedMusic: selectedMusicKey
        });
    };

    const handleNoMusic = () => {
        navigation.navigate('Förberedelse', {
            program: program,
            initialTime: initialTime,
            selectedMusic: null
        });
    };

    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.titleText}>Välj Bakgrundsmusik</Text>
            <Text style={styles.infoText}>Välj en bakgrundsmusik för din session, eller välj "Ingen musik".</Text>

            <View style={styles.buttonGroup}>
                {musicOptions.map((option) => (
                    <View key={option.key} style={styles.buttonWrapper}>
                        <Button
                            title={option.name}
                            onPress={() => handleMusicSelect(option.key)}
                            color="#007bff"
                        />
                    </View>
                ))}
            </View>

            <View style={styles.buttonWrapper}>
                <Button
                    title="Ingen musik"
                    onPress={handleNoMusic}
                    color="#888"
                />
            </View>
        </View>
    );
}
// Ska flyttas till GlobalStyles.js senare
const styles = StyleSheet.create({
    infoText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginHorizontal: 30,
        marginBottom: 40,
    },
    buttonGroup: {
        marginBottom: 20,
        width: '80%',
    },
    buttonWrapper: {
        marginVertical: 10,
    }
});