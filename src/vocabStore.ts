import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VocabWord {
  english: string;
  thai: string;
  pos: string;
}

const VOCAB_LIST_KEY = '@vocab_list';
const CURRENT_WORD_KEY = '@current_word';
const LAST_SHUFFLE_DATE_KEY = '@last_shuffle_date';

export const saveVocabList = async (list: VocabWord[]) => {
  try {
    await AsyncStorage.setItem(VOCAB_LIST_KEY, JSON.stringify(list));
    // If it's the first time saving, shuffle a word immediately
    const currentWord = await getCurrentWord();
    if (!currentWord && list.length > 0) {
      await shuffleWord(list);
    }
  } catch (e) {
    console.error('Failed to save vocab list', e);
  }
};

export const getVocabList = async (): Promise<VocabWord[]> => {
  try {
    const data = await AsyncStorage.getItem(VOCAB_LIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to get vocab list', e);
    return [];
  }
};

export const getCurrentWord = async (): Promise<VocabWord | null> => {
  try {
    const data = await AsyncStorage.getItem(CURRENT_WORD_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to get current word', e);
    return null;
  }
};

export const shuffleWord = async (list?: VocabWord[]) => {
  try {
    const vocabList = list || await getVocabList();
    if (vocabList.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * vocabList.length);
    const newWord = vocabList[randomIndex];

    await AsyncStorage.setItem(CURRENT_WORD_KEY, JSON.stringify(newWord));
    
    // Save current date string
    const today = new Date().toDateString();
    await AsyncStorage.setItem(LAST_SHUFFLE_DATE_KEY, today);
    
    return newWord;
  } catch (e) {
    console.error('Failed to shuffle word', e);
    return null;
  }
};

export const checkAndShuffleDaily = async () => {
  try {
    const lastDate = await AsyncStorage.getItem(LAST_SHUFFLE_DATE_KEY);
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      const newWord = await shuffleWord();
      return newWord;
    }
    return await getCurrentWord();
  } catch (e) {
    console.error('Failed to check daily shuffle', e);
    return await getCurrentWord();
  }
};
