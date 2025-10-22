import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    // Stilar för hela appen
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },

    // Delade stilar för knappar
    button: {
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
    },

    // Delade stilar för text
    titleText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#000000ff',
        position: 'absolute',
        top: 160,
        textAlign: 'center',
    },
    interimMessageText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },

    // Timer-specifika stilar
    timerText: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
    },
    messageBox: {
        padding: 15,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    messageText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007bff',
    },
    progressBarContainer: {
        width: '80%',
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 20,
        marginBottom: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#841584',
    },
    // NYA STILAR FÖR TIPS
    tipContainer: {

        position: 'absolute',
        bottom: 40, // <-- Låser tipset 50 pixlar från botten av skärmen
        borderWidth: 1,
        borderColor: '#72727207',
        backgroundColor: '#f0f0f0ff',
        padding: 20,
        shadowColor: '#727272ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
        width: '100%',
        height: 120,
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#353535ff',
        marginBottom: 8,
        textAlign: 'center',
    },
    tipText: {
        fontSize: 17,
        color: '#333',
        textAlign: 'center',
        lineHeight: 25,
        fontStyle: 'italic',
        fontFamily: 'helvetica',
    },
});
