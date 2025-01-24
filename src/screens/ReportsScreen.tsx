import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useMapContext } from '../context/MapContext';
import { Report } from '../types';

const ReportsScreen = () => {
  const { reports } = useMapContext();

  const renderItem = ({ item }: { item: Report }) => (
    <View style={styles.reportItem}>
      <Text style={styles.reportTitle}>{item.title}</Text>
      <Text style={styles.reportDescription}>{item.description}</Text>
      <Text style={styles.reportTime}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {reports.length > 0 ? (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay reportes aún</Text>
          <Text style={styles.emptySubtext}>Los reportes que crees aparecerán aquí</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  reportItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  reportTime: {
    fontSize: 14,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default ReportsScreen;
