import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { ProfileStackParamList } from '../../types/navigation';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

type StatsScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Estadisticas'>;

const StatsScreen = () => {
  const navigation = useNavigation<StatsScreenNavigationProp>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      if (user?.id) {
        const data = await userService.getUserStats(user.id);
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const reportsByStatusData = {
    labels: ['Pendientes', 'Verificados', 'Rechazados'],
    datasets: [
      {
        data: [
          stats.pendingReports || 0,
          stats.verifiedReports || 0,
          stats.rejectedReports || 0,
        ],
      },
    ],
  };

  const reportsByMonthData = {
    labels: stats.monthlyReports?.map((item: any) => item.month) || [],
    datasets: [
      {
        data: stats.monthlyReports?.map((item: any) => item.count) || [],
      },
    ],
  };

  const verificationsPieData = [
    {
      name: 'Verificados',
      population: stats.verifiedReports || 0,
      color: '#34C759',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Pendientes',
      population: stats.pendingReports || 0,
      color: '#FFD60A',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Rechazados',
      population: stats.rejectedReports || 0,
      color: '#FF3B30',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Estadísticas</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsOverview}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalReports || 0}</Text>
            <Text style={styles.statLabel}>Total Reportes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalVerifications || 0}</Text>
            <Text style={styles.statLabel}>Verificaciones</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.contributionRank || '-'}</Text>
            <Text style={styles.statLabel}>Ranking</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Reportes por Estado</Text>
          <PieChart
            data={verificationsPieData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Reportes por Mes</Text>
          <BarChart
            data={reportsByMonthData}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            showValuesOnTopOfBars
          />
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Logros</Text>
          {stats.achievements?.map((achievement: any, index: number) => (
            <View key={index} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons
                  name={achievement.completed ? 'trophy' : 'trophy-outline'}
                  size={24}
                  color={achievement.completed ? '#FFD700' : '#666'}
                />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(achievement.progress / achievement.target) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {achievement.progress} / {achievement.target}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartSection: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
});

export default StatsScreen;
