import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system/legacy';

import {
  VocabWord,
  checkAndShuffleDaily,
  shuffleWord,
  saveVocabList,
  getVocabList,
} from '../vocabStore';
import { updateAllWidgets } from '../widgetUpdate';

export default function HomeScreen() {
  const [currentWord, setCurrentWord] = useState<VocabWord | null>(null);
  const [vocabCount, setVocabCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    loadData();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // Back in the foreground: the widget may have shuffled, or a new day may have started
        loadData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const loadData = async () => {
    const word = await checkAndShuffleDaily();
    setCurrentWord(word);
    const list = await getVocabList();
    setVocabCount(list.length);
    // Pass the word directly; reading `currentWord` state here would be stale
    updateAllWidgets(word);
  };

  const handleShuffle = async () => {
    if (vocabCount === 0) {
      Alert.alert('No Vocabulary', 'Please upload a CSV file first.');
      return;
    }
    const newWord = await shuffleWord();
    if (newWord) {
      setCurrentWord(newWord);
      updateAllWidgets(newWord);
    }
  };

  const handleUploadCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/csv',
          'text/comma-separated-values',
          'application/csv',
          'application/vnd.ms-excel',
          'text/plain',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const fileUri = result.assets[0].uri;

      let fileContent = '';
      if (Platform.OS === 'web') {
        const response = await fetch(fileUri);
        fileContent = await response.text();
      } else {
        fileContent = await FileSystem.readAsStringAsync(fileUri);
      }

      // Parse synchronously (string input), so errors land in the try/catch above
      const results = Papa.parse<Record<string, string | undefined>>(fileContent, {
        header: true,
        skipEmptyLines: true,
        // Accept "English", " thai ", and headers with a UTF-8 BOM (Excel exports)
        transformHeader: header => header.replace(/^\uFEFF/, '').trim().toLowerCase(),
      });

      const formattedList: VocabWord[] = results.data
        .map(item => ({
          english: (item.english ?? '').trim(),
          thai: (item.thai ?? '').trim(),
          pos: (item.pos ?? '').trim(),
        }))
        .filter(item => item.english && item.thai);

      if (formattedList.length > 0) {
        await saveVocabList(formattedList);
        Alert.alert('Success', `Loaded ${formattedList.length} words.`);
        await loadData();
      } else {
        Alert.alert('Error', 'No valid words found in the CSV. Make sure it has "english" and "thai" columns.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Error', 'Failed to upload or read the CSV file.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Vocab Mobile</Text>
        <Text style={styles.subText}>Total Words: {vocabCount}</Text>
      </View>

      <View style={styles.card}>
        {currentWord ? (
          <>
            <Text style={styles.englishText}>{currentWord.english}</Text>
            {currentWord.pos ? (
              <Text style={styles.posText}>({currentWord.pos})</Text>
            ) : null}
            <Text style={styles.thaiText}>{currentWord.thai}</Text>
          </>
        ) : (
          <Text style={styles.placeholderText}>
            No word available.{'\n'}Upload a CSV file to get started.
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleShuffle}>
          <Text style={styles.buttonText}>Shuffle Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.push('/list')}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>View All Words</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleUploadCSV}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Upload CSV</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minHeight: 250,
  },
  englishText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2980B9',
    textAlign: 'center',
  },
  posText: {
    fontSize: 16,
    color: '#95A5A6',
    marginTop: 8,
    fontStyle: 'italic',
  },
  thaiText: {
    fontSize: 24,
    color: '#34495E',
    marginTop: 16,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#BDC3C7',
    textAlign: 'center',
    lineHeight: 28,
  },
  actions: {
    marginTop: 60,
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2980B9',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2980B9',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#2980B9',
  },
});
