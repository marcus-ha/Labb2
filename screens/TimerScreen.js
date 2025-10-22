import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, Button } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import GlobalStyles from '../styles/GlobalStyles';
import { saveSession } from '../utils/storage';
import { Audio } from 'expo-av';

// Datastruktur för 60-minuters programmet
const CUSTOM_PROGRAM_60_MIN_STEPS = [
    { name: 'Djupa andetag', time: 10 },
    { name: 'Work', time: 15 },
    { name: 'Paus', time: 15 },
    { name: 'Work', time: 15 },
    { name: 'Paus', time: 15 },
    { name: 'Work', time: 15 },
];

// Datastruktur för 120-minuters programmet
const CUSTOM_PROGRAM_120_MIN_STEPS = [
    { name: 'Djupa andetag', time: 60 },
    { name: 'Work', time: 25 * 60 },
    { name: 'Paus', time: 15 * 60 },
    { name: 'Work', time: 30 * 60 },
    { name: 'Paus', time: 15 * 60 },
    { name: 'Work', time: 35 * 60 },
];

const BREAK_TIPS = [
    "Ta några djupa, långsamma andetag.",
    "Res dig upp och sträck ut armar och ben. Lossa på spänningar.",
    "Ta ett glas vatten. Hydrering hjälper koncentrationen.",
    "Titta bort från skärmen i 20 sekunder. Fokusera på något långt bort.",
    "Låt hjärnan vila en stund från uppgiften.",
    "Gör en snabb 'body scan'. Slappna av i axlar och käke.",
    "Slut ögonen och lyssna på din egen andning.",
    "Ta tre djupa andetag och räkna långsamt till fyra på inandning och utandning.",
    "Känn hur fötterna vilar mot golvet och låt kroppen bli tung.",
    "Lägg händerna på magen och följ andningens rörelse.",
    "Låt axlarna sjunka och släpp taget om spänningar.",
    "Lägg märke till fem saker du kan höra just nu.",
    "Slut ögonen och föreställ dig en plats där du känner dig lugn.",
    "Känn efter hur det känns i kroppen",
    "Sitt still en minut och fokusera bara på att vara närvarande.",
    "Ta en mjuk stretch långsamt och medvetet.",
    "Följ tre andetag utan att tänka på något annat.",
    "Le mjukt för dig själv, även om det känns konstigt.",
    "Lägg märke till känslan av stolen du sitter på eller bordet du rör vid.",
    "Lyssna till tystnaden runt dig, även om den är fylld av små ljud.",
];

const MUSIC_ASSETS = {
    beach: require('../assets/sounds/beach.mp3'),
    rain: require('../assets/sounds/rain.mp3'),
};

export default function TimerScreen({ route, navigation }) {
    const programToRun = route.params?.program;
    const isCustomProgram60 = programToRun === 'customProgram60';
    const isCustomProgram120 = programToRun === 'customProgram120';
    const isCustomProgram = isCustomProgram60 || isCustomProgram120;
    const programSteps = isCustomProgram60 ? CUSTOM_PROGRAM_60_MIN_STEPS : CUSTOM_PROGRAM_120_MIN_STEPS;
    const initialTime = isCustomProgram ? programSteps[0].time : (route.params?.initialTime || 25 * 60);
    const selectedMusic = route.params?.selectedMusic;

    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const [currentPhase, setCurrentPhase] = useState(isCustomProgram ? 'custom' : 'work');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedCycles, setCompletedCycles] = useState(0);
    const [showInterimMessage, setShowInterimMessage] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [currentTip, setCurrentTip] = useState('');

    const intermSoundObject = useRef(new Audio.Sound());
    const finalSoundObject = useRef(new Audio.Sound());
    const backgroundMusicObject = useRef(new Audio.Sound()); // <--- NY useRef

    // Funktion för att välja ett slumpmässigt tips
    const setRandomTip = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * BREAK_TIPS.length);
        setCurrentTip(BREAK_TIPS[randomIndex]);
    }, []);

    // Ladda ljudfilerna en gång
    useEffect(() => {
        const loadSounds = async () => {
            try {
                await intermSoundObject.current.loadAsync(require('../assets/sounds/bell.mp3'));
                await finalSoundObject.current.loadAsync(require('../assets/sounds/final_chime.mp3'));
                // *** NY PLATS FÖR MUSIKSTART ***
                if (route.params?.selectedMusic) {
                    // Vi anropar den direkta logiken här, men det är enklare att använda din befintliga useCallback.
                    // För att använda useCallback med [] måste vi ta bort alla beroenden.
                    // Vi behåller din struktur, men tömmer listan.
                    // För att detta ska funka måste vi lita på att useCallback är stabil eller använda en referens.
                    // Det enklaste är:
                    loadAndPlayMusic(route.params.selectedMusic);
                }
            } catch (error) {
                console.error("Kunde inte ladda ljudfilen:", error);
            }
        };
        loadSounds();

        // Spela bakgrundsmusik om den är vald
        if (selectedMusic) {
            loadAndPlayMusic(selectedMusic);
        }

        return () => {
            intermSoundObject.current.unloadAsync();
            finalSoundObject.current.unloadAsync();
            stopMusic(); // <-- Stoppar och avlastar bakgrundsmusiken när skärmen lämnas
        };
    }, []); // <--- TÖMD LISTA: Detta gör att koden körs EN GÅNG vid montering.

    // Ljudfunktioner med useCallback
    const playIntermSound = useCallback(async () => {
        try {
            const status = await intermSoundObject.current.getStatusAsync();
            if (status.isLoaded) {
                if (status.isPlaying) {
                    await intermSoundObject.current.stopAsync();
                }
                await intermSoundObject.current.replayAsync();
            }
        } catch (error) {
            console.error("Kunde inte spela upp ljudet:", error);
        }
    }, []);

    const playFinalSound = useCallback(async () => {
        try {
            const status = await finalSoundObject.current.getStatusAsync();
            if (status.isLoaded) {
                if (status.isPlaying) {
                    await finalSoundObject.current.stopAsync();
                }
                await finalSoundObject.current.replayAsync();
            }
        } catch (error) {
            console.error("Kunde inte spela upp ljudet:", error);
        }
    }, []);

    // Funktioner för bakgrundsmusik
    const loadAndPlayMusic = useCallback(async (musicKey) => {
        if (!musicKey) return;

        const asset = MUSIC_ASSETS[musicKey];
        if (!asset) return; // Stoppa om asset inte finns

        try {
            // Kontrollera och avlasta gammal musik om den finns
            const status = await backgroundMusicObject.current.getStatusAsync();
            if (status.isLoaded) {
                await backgroundMusicObject.current.unloadAsync();
            }

            // Ladda, spela och loopa musiken på låg volym
            await backgroundMusicObject.current.loadAsync(asset, { isLooping: true, volume: 0.3 });
            await backgroundMusicObject.current.playAsync();
        } catch (error) {
            console.error("Kunde inte ladda eller spela bakgrundsmusik:", error);
        }
    }, []);

    const stopMusic = useCallback(async () => {
        try {
            const status = await backgroundMusicObject.current.getStatusAsync();

            // Kolla om ljudet är laddat, spelar, eller håller på att laddas (isLoaded är säkrast)
            if (status.isLoaded || status.isLoaded === false) {
                // Om den är laddad, eller har försökt ladda (status finns), kan vi avlasta.
                // Om isPlaying är true, stoppar vi först.
                if (status.isPlaying) {
                    await backgroundMusicObject.current.stopAsync();
                }
                await backgroundMusicObject.current.unloadAsync();
            }
            // Om den var i ett "loading"-tillstånd, och vi inte kunde avlasta, låt den vara. 
            // Nästa loadAsync kommer då att hantera unload först, vilket är mindre idealiskt 
            // men undviker att krascha här.

        } catch (error) {
            // Fånga felet om den klagar på att den redan laddar/avlastar
            if (error.message !== 'The Sound is already loading.') {
                console.error("Kunde inte stoppa eller avlasta bakgrundsmusik:", error);
            }
        }
    }, []);

    // Session avslut
    const handleSessionComplete = useCallback((isCompleted_Status) => {
        let duration = 'Okänd';
        if (sessionStartTime) {
            const endTime = new Date();
            const durationMs = endTime.getTime() - sessionStartTime.getTime();
            const totalMinutes = durationMs / 60000;
            const roundedDurationMinutes = Math.round(totalMinutes);
            const finalDurationMinutes = Math.max(1, roundedDurationMinutes);

            duration = `${finalDurationMinutes} minuter`;
            if (isCompleted_Status === false) {
                duration += " (avbruten)";
            }
            console.log("Sessionens faktiska längd (logg):", duration);
        }

        playFinalSound();
        stopMusic(); // <-- MÅSTE KÖRAS INNAN NAVIGATION.

        let programName = 'Pomodoro';
        if (isCustomProgram60) {
            programName = 'Anpassat (60 min)';
        } else if (isCustomProgram120) {
            programName = 'Anpassat (120 min)';
        }

        const sessionData = {
            date: new Date().toLocaleDateString('sv-SE'),
            time: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
            program: programName,
            duration: duration,
            isCompleted: isCompleted_Status
        };
        saveSession(sessionData);
        navigation.navigate('Avslutad');
    }, [
        isCustomProgram60,
        isCustomProgram120,
        navigation,
        sessionStartTime,
        playFinalSound,
        stopMusic
    ]);

    // Timerlogik
    useEffect(() => {
        let interval;
        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime(t => t - 1);
            }, 1000);
        } else if (time === 0 && isRunning) {
            setIsRunning(false);

            const isSessionComplete = isCustomProgram
                ? (currentStepIndex >= programSteps.length - 1)
                : (currentPhase === 'long_break');

            if (isSessionComplete) {
                handleSessionComplete(true);
            } else {
                playIntermSound();
                setShowInterimMessage(true);

                setTimeout(() => {
                    if (isCustomProgram) {
                        const nextStepIndex = currentStepIndex + 1;
                        if (nextStepIndex < programSteps.length) {
                            setCurrentStepIndex(nextStepIndex);
                            setTime(programSteps[nextStepIndex].time);
                            setIsRunning(true);

                            // *** LÄGG TILL HÄR FÖR ANPASSADE PROGRAM ***
                            if (programSteps[nextStepIndex].name.toLowerCase().includes('paus') || programSteps[nextStepIndex].name.toLowerCase().includes('andetag')) {
                                setRandomTip();
                            }
                        }
                    } else {
                        if (currentPhase === 'work') {
                            setCompletedCycles(prevCycles => {
                                const nextCycles = prevCycles + 1;
                                if (nextCycles >= 4) {
                                    setCurrentPhase('long_break');
                                    setTime(15 * 60);
                                } else {
                                    setCurrentPhase('short_break');
                                    setTime(5 * 60);
                                }
                                return nextCycles;
                            });
                        } else if (currentPhase === 'short_break') {
                            setCurrentPhase('work');
                            setTime(25 * 60);
                        }
                        setIsRunning(true);
                    }
                }, 2000);
            }
        }
        return () => clearInterval(interval);
    }, [
        isRunning,
        time,
        currentPhase,
        currentStepIndex,
        programSteps,
        handleSessionComplete,
        setRandomTip,
        playIntermSound
    ]);

    // Hantera timeout för interimMessage
    useEffect(() => {
        let timeout;
        if (showInterimMessage) {
            timeout = setTimeout(() => setShowInterimMessage(false), 2000);
        }
        return () => clearTimeout(timeout);
    }, [showInterimMessage]);

    // Nytt block för att rotera tips under pauser
    useEffect(() => {
        let tipInterval;

        const isBreakPhase = currentPhase === 'short_break' || currentPhase === 'long_break';

        // Vi kollar även programStep-namnet för anpassade program
        const isCustomBreak = isCustomProgram && (
            programSteps[currentStepIndex].name.toLowerCase().includes('paus') ||
            programSteps[currentStepIndex].name.toLowerCase().includes('andetag')
        );

        if (isRunning && (isBreakPhase || isCustomBreak)) {
            // Rotera tipset var 10:e sekund (10000 millisekunder)
            tipInterval = setInterval(() => {
                setRandomTip();
            }, 5000);
        }

        // Rensar intervallet när fasen byts, timern pausas/stoppas, eller komponenten demonteras
        return () => clearInterval(tipInterval);
    }, [isRunning, currentPhase, currentStepIndex, isCustomProgram, programSteps, setRandomTip]);

    // Avbryt-knapp
    const handleCancel = () => {
        setIsRunning(false);
        handleSessionComplete(false);
        setSessionStartTime(null);
    };

    // Timer-funktioner
    const startTimer = () => {
        if (!isRunning && time > 0) {
            setIsRunning(true);
            if (!sessionStartTime) {
                setSessionStartTime(new Date());
            }
        }
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setSessionStartTime(null);
        if (isCustomProgram) {
            setCurrentStepIndex(0);
            setTime(programSteps[0].time);
        } else {
            setTime(initialTime);
            setCompletedCycles(0);
            setCurrentPhase('work');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    // Titel för fas
    let phaseTitle = '';
    if (isCustomProgram) {
        phaseTitle = programSteps[currentStepIndex].name;
    } else {
        if (currentPhase === 'work') {
            phaseTitle = 'Arbetstid';
        } else if (currentPhase === 'short_break') {
            phaseTitle = 'Kort Paus';
        } else {
            phaseTitle = 'Lång Paus';
        }
    }

    // Progressbar
    const totalTimeForStep = isCustomProgram
        ? programSteps[currentStepIndex].time
        : (currentPhase === 'work' ? 25 * 60 : (currentPhase === 'short_break' ? 5 * 60 : 15 * 60));
    const progress = totalTimeForStep > 0 ? 100 - (time / totalTimeForStep) * 100 : 0;

    return (
        <View style={GlobalStyles.container}>
            {showInterimMessage ? (
                <View>
                    <Text style={GlobalStyles.interimMessageText}>Delmoment klar!</Text>
                </View>
            ) : (
                <>
                    <Text style={GlobalStyles.titleText}>{phaseTitle}</Text>

                    {/* NY LOGIK: Kontrollera om phaseTitle innehåller "Paus" 
                      ELLER om det är ett anpassat programsteg som är en paus.
                      Vi använder .toLowerCase().includes('paus') för att fånga alla pauslägen. 
                      Vi lägger också till 'Djupa andetag' som en paus-situation för tips.
                    */}


                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <AnimatedCircularProgress
                                size={250}
                                width={15}
                                fill={progress}
                                tintColor="#00e0ff"
                                backgroundColor="#3d5875"
                                lineCap="round"
                            >
                                {() => (
                                    <Text style={GlobalStyles.timerText}>{formatTime(time)}</Text>
                                )}
                            </AnimatedCircularProgress>

                            <View style={GlobalStyles.buttonContainer}>
                                <Button title={isRunning ? 'Pausa' : 'Starta'} onPress={isRunning ? pauseTimer : startTimer} />
                                <Button title="Återställ" onPress={resetTimer} color="red" />
                                <Button title="Avbryt" onPress={handleCancel} color="#888" />
                            </View>
                            {(phaseTitle.toLowerCase().includes('paus') || phaseTitle.toLowerCase().includes('andetag')) && currentTip.length > 0 && (
                                <View style={GlobalStyles.tipContainer}>
                                    <Text style={GlobalStyles.tipTitle}>💡 Tips!</Text>
                                    <Text style={GlobalStyles.tipText}>
                                        {currentTip}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}
