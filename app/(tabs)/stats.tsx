import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TrendingUp, Trophy, Medal, Filter } from 'lucide-react-native';
import useStats from '@/hooks/useStats';
import PlayerListItem from '@/components/PlayerListItem';

export default function StatsScreen() {
  const { fetchLeaderboard, loading, error } = useStats();
  const [activeTab, setActiveTab] = useState<'goals' | 'assists' | 'rating'>('goals');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);
  
  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeaderboard(activeTab);
      setLeaderboardData(data || []);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'goals' && styles.activeTab]}
          onPress={() => setActiveTab('goals')}
        >
          <TrendingUp 
            size={18} 
            color={activeTab === 'goals' ? '#FFFFFF' : '#BBBBBB'} 
          />
          <Text style={[styles.tabText, activeTab === 'goals' && styles.activeTabText]}>
            Goals
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'assists' && styles.activeTab]}
          onPress={() => setActiveTab('assists')}
        >
          <Medal 
            size={18} 
            color={activeTab === 'assists' ? '#FFFFFF' : '#BBBBBB'} 
          />
          <Text style={[styles.tabText, activeTab === 'assists' && styles.activeTabText]}>
            Assists
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'rating' && styles.activeTab]}
          onPress={() => setActiveTab('rating')}
        >
          <Trophy 
            size={18} 
            color={activeTab === 'rating' ? '#FFFFFF' : '#BBBBBB'} 
          />
          <Text style={[styles.tabText, activeTab === 'rating' && styles.activeTabText]}>
            Rating
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === 'goals' ? 'Top Scorers' : 
               activeTab === 'assists' ? 'Top Assists' : 
               'Highest Rated Players'}
            </Text>
            
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={18} color="#BBBBBB" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1E88E5" />
            </View>
          ) : leaderboardData.length > 0 ? (
            <View style={styles.leaderboardContainer}>
              {leaderboardData.map((item, index) => (
                <View key={item.player_id} style={styles.leaderboardItem}>
                  <View style={styles.leaderboardRank}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  
                  <View style={styles.leaderboardContent}>
                    <PlayerListItem
                      name={item.players.full_name || item.players.username}
                      avatarUrl={item.players.avatar_url}
                      position={item.players.position}
                      jerseyNumber={item.players.jersey_number}
                      stats={
                        activeTab === 'goals' ? 
                          { goals: item.total_goals } : 
                        activeTab === 'assists' ? 
                          { assists: item.total_assists } : 
                          undefined
                      }
                      rating={activeTab === 'rating' ? item.avg_rating : undefined}
                      style={styles.playerItem}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No data available</Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Trends</Text>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    data: [
                      Math.random() * 10,
                      Math.random() * 10,
                      Math.random() * 10,
                      Math.random() * 10,
                      Math.random() * 10,
                      Math.random() * 10
                    ],
                    color: (opacity = 1) => `rgba(30, 136, 229, ${opacity})`,
                    strokeWidth: 2
                  }
                ]
              }}
              width={340}
              height={200}
              chartConfig={{
                backgroundColor: '#1A1A1A',
                backgroundGradientFrom: '#1A1A1A',
                backgroundGradientTo: '#1A1A1A',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#1E88E5'
                }
              }}
              bezier
              style={styles.chart}
            />
            
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#1E88E5' }]} />
                <Text style={styles.legendText}>
                  {activeTab === 'goals' ? 'Goals' : 
                   activeTab === 'assists' ? 'Assists' : 
                   'Rating'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Rankings</Text>
          
          <View style={styles.teamRankingsContainer}>
            <View style={styles.teamRankingItem}>
              <Text style={styles.teamRankingPosition}>1</Text>
              <Text style={styles.teamRankingName}>FC Barcelona</Text>
              <Text style={styles.teamRankingValue}>32 pts</Text>
            </View>
            
            <View style={styles.teamRankingItem}>
              <Text style={styles.teamRankingPosition}>2</Text>
              <Text style={styles.teamRankingName}>Real Madrid</Text>
              <Text style={styles.teamRankingValue}>28 pts</Text>
            </View>
            
            <View style={styles.teamRankingItem}>
              <Text style={styles.teamRankingPosition}>3</Text>
              <Text style={styles.teamRankingName}>Bayern Munich</Text>
              <Text style={styles.teamRankingValue}>26 pts</Text>
            </View>
            
            <View style={styles.teamRankingItem}>
              <Text style={styles.teamRankingPosition}>4</Text>
              <Text style={styles.teamRankingName}>Manchester City</Text>
              <Text style={styles.teamRankingValue}>25 pts</Text>
            </View>
            
            <View style={styles.teamRankingItem}>
              <Text style={styles.teamRankingPosition}>5</Text>
              <Text style={styles.teamRankingName}>Liverpool</Text>
              <Text style={styles.teamRankingValue}>24 pts</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1A1A1A',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#1E88E5',
  },
  tabText: {
    color: '#BBBBBB',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    color: '#BBBBBB',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  leaderboardContainer: {
    marginBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  leaderboardRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  leaderboardContent: {
    flex: 1,
  },
  playerItem: {
    marginVertical: 0,
  },
  emptyContainer: {
    backgroundColor: '#1A1A1A',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#BBBBBB',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  chartContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColor: {
    width: 16,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    color: '#BBBBBB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  teamRankingsContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  teamRankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  teamRankingPosition: {
    width: 30,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  teamRankingName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 10,
  },
  teamRankingValue: {
    color: '#1E88E5',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});