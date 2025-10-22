import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@pomodoro_sessions';

/**
 * Hämtar alla sparade sessioner.
 * @returns {Promise<Array>} En array av sessionsobjekt.
 */
export const loadSessions = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        // Återställer till en tom array om ingen data finns
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error("Fel vid laddning av sessioner:", e);
        return [];
    }
};

/**
 * Sparar en ny session.
 * @param {object} newSessionData - Objekt som innehåller sessionens data (date, time, program, duration).
 */
export const saveSession = async (newSessionData) => {
    try {
        const existingSessions = await loadSessions();
        // Lägg till den nya sessionen först i listan
        const updatedSessions = [newSessionData, ...existingSessions];
        const jsonValue = JSON.stringify(updatedSessions);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        console.log("Session sparad:", newSessionData);
    } catch (e) {
        console.error("Fel vid sparande av session:", e);
    }
};

/**
 * Rensar alla sparade sessioner (används för testning/debug).
 */
export const clearAllSessions = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log("Alla sessioner rensade.");
    } catch (e) {
        console.error("Fel vid rensning av sessioner:", e);
    }
};

export const deleteSession = async (indexToDelete) => {
    try {
        const sessionsJson = await AsyncStorage.getItem(STORAGE_KEY);
        let sessions = sessionsJson != null ? JSON.parse(sessionsJson) : [];

        // Kontrollera att indexet är giltigt
        if (indexToDelete >= 0 && indexToDelete < sessions.length) {
            // Tar bort 1 element vid det angivna indexet
            sessions.splice(indexToDelete, 1);

            const updatedJsonValue = JSON.stringify(sessions);
            await AsyncStorage.setItem(STORAGE_KEY, updatedJsonValue);
            console.log('Session raderad framgångsrikt vid index:', indexToDelete);
            return true;
        } else {
            console.error('Ogiltigt index för radering:', indexToDelete);
            return false;
        }
    } catch (e) {
        console.error('Fel vid radering av session:', e);
        return false;
    }
};