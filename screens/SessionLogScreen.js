import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { loadSessions, clearAllSessions, deleteSession } from '../utils/storage';
import GlobalStyles from '../styles/GlobalStyles';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Ska flyttas till GLobalStyles.js senare
const localStyles = StyleSheet.create({
    logEntry: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#841584',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logDetails: {
        flex: 1,
    },
    statusContainer: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    completedBg: {
        backgroundColor: '#e6ffe6',
        shadowColor: 'green',
    },
    interruptedBg: {
        backgroundColor: '#f0f0f0',
        shadowColor: '#333',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: '#888',
    },
    clearButtonContainer: {
        marginTop: 20,
        marginBottom: 40,
        paddingHorizontal: 16,
    }
});

export default function SessionLogScreen() {
    const [sessions, setSessions] = useState([]);

    const fetchSessions = async () => {
        const savedSessions = await loadSessions();
        setSessions(savedSessions);
    };

    useFocusEffect(
        useCallback(() => {
            fetchSessions();
        }, [])
    );

    const handleClearSessions = async () => {
        Alert.alert(
            "Rensa historik",
            "Är du säker på att du vill radera ALLA loggade sessioner? Denna åtgärd kan inte ångras.",
            [
                {
                    text: "Avbryt",
                    style: "cancel"
                },
                {
                    text: "Radera Allt",
                    onPress: async () => {
                        await clearAllSessions();
                        fetchSessions();
                    },
                    style: "destructive"
                }
            ]
        );
    };

    // Hanterar radering av en enstaka session
    const handleDeleteSession = (index, sessionName) => {
        Alert.alert(
            "Radera session",
            `Är du säker på att du vill radera sessionen "${sessionName}"?`,
            [
                {
                    text: "Avbryt",
                    style: "cancel"
                },
                {
                    text: "Radera",
                    onPress: async () => {
                        await deleteSession(index);
                        fetchSessions(); // Uppdatera listan efter radering
                    },
                    style: "destructive"
                }
            ]
        );
    };

    // Komponent för att rendera varje sessionspost
    const renderItem = ({ item, index }) => {
        const isCompleted = item.isCompleted === true;

        const statusIcon = isCompleted ? 'checkmark-done-circle' : 'checkmark-done-circle';
        const statusColor = isCompleted ? '#28a745' : '#777';
        const statusBgStyle = isCompleted ? localStyles.completedBg : localStyles.interruptedBg;

        const sessionDescription = `${item.program || 'Okänt'} (${item.duration || 'Okänd'})`;

        return (
            // Omsluter posten i en TouchableOpacity
            <TouchableOpacity
                style={localStyles.logEntry}
                onLongPress={() => handleDeleteSession(index, sessionDescription)} // Använd långt tryck för att radera
                activeOpacity={0.7}
            >
                <View style={localStyles.logDetails}>
                    <Text style={localStyles.dateText}>
                        {item.date} kl. {item.time || 'N/A'}
                    </Text>
                    <Text style={localStyles.detailText}>
                        **Program:** {item.program || 'Okänt program'}
                    </Text>
                    <Text style={localStyles.detailText}>
                        **Varaktighet:** {item.duration || 'Okänd'}
                    </Text>
                </View>

                <View style={[localStyles.statusContainer, statusBgStyle]}>
                    <Ionicons
                        name={statusIcon}
                        size={24}
                        color={statusColor}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: GlobalStyles.container.backgroundColor }}>
            <Text style={localStyles.header}>Sessionslogg</Text>

            {sessions.length > 0 ? (
                <>
                    <FlatList
                        data={sessions}
                        // Key som skickar index till renderItem
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                    <View style={localStyles.clearButtonContainer}>
                        <Button
                            title="Rensa all historik"
                            onPress={handleClearSessions}
                            color="#cc0000"
                        />
                    </View>
                </>
            ) : (
                <Text style={localStyles.emptyMessage}>
                    Inga slutförda sessioner loggade än.
                </Text>
            )}
        </View>
    );
}