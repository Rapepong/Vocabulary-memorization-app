import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getVocabList, VocabWord } from '../vocabStore';

export default function ListScreen() {
  const [vocabList, setVocabList] = useState<VocabWord[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    const list = await getVocabList();
    setVocabList(list);
  };

  const renderItem = ({ item }: { item: VocabWord }) => (
    <View style={styles.itemCard}>
      <Text style={styles.englishText}>{item.english}</Text>
      {item.pos ? <Text style={styles.posText}>({item.pos})</Text> : null}
      <Text style={styles.thaiText}>{item.thai}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>All Words ({vocabList.length})</Text>
      </View>

      <FlatList
        data={vocabList}
        keyExtractor={(item, index) => `${item.english}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No vocabulary found.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2980B9',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  englishText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980B9',
  },
  posText: {
    fontSize: 14,
    color: '#95A5A6',
    fontStyle: 'italic',
    marginTop: 4,
  },
  thaiText: {
    fontSize: 16,
    color: '#34495E',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#95A5A6',
    marginTop: 40,
    fontSize: 16,
  },
});
