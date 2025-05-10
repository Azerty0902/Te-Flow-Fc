import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Bell, Trophy, TrendingUp, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from '@/hooks/useAuth';
import usePlayer from '@/hooks/usePlayer';
import FootballCard from '@/components/FootballCard';
import StatsBar from '@/components/StatsBar';

export default function HomeScreen() {
  const { session } = useAuth();
  const { player, playerStats, loading, error, fetchPlayerMatches } = usePlayer(session?.user.id);
  const [refreshing, setRefreshing] = useState(false);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  
  useEffect(() => {
    if (session?.user.id) {
      loadMatches();
    }
  }, [session]);
  
  const loadMatches = async () => {
    try {
      const matches = await fetchPlayerMatches(3);
      setRecentMatches(matches || []);
    } catch (err) {
      console.error('Error loading matches:', err);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };
  
  if (!player) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }
  
  // Calculate the player's stats for the card
  const cardStats = {
    pace: 70,
    shooting: playerStats?.total_goals ? Math.min(70 + playerStats.total_goals, 99) : 65,
    passing: playerStats?.total_assists ? Math.min(65 + playerStats.total_assists, 95) : 65,
    dribbling: 75,
    defending: 60,
    physical: 72,
    overall: playerStats?.avg_rating ? Math.round(playerStats.avg_rating * 10) : 75
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A237E', '#0D47A1', '#121212']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.playerName}>{player.full_name || player.username}</Text>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Bell color="#FFFFFF" size={24} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#FFFFFF"
          />
        }
      >
        <View style={styles.cardContainer}>
          <FootballCard
            playerName={player.full_name || player.username}
            position={player.position || 'ST'}
            stats={cardStats}
            imageUrl={player.avatar_url || undefined}
            style={styles.playerCard}
          />
          
          <View style={styles.statsOverview}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {playerStats?.total_goals || 0}
              </Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {playerStats?.total_assists || 0}
              </Text>
              <Text style={styles.statLabel}>Assists</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {playerStats?.avg_rating ? playerStats.avg_rating.toFixed(1) : '0.0'}
              </Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Performance</Text>
          
          <View style={styles.performanceContainer}>
            <StatsBar 
              label="Goals" 
              value={playerStats?.total_goals || 0} 
              maxValue={20} 
              color="#1E88E5" 
            />
            <StatsBar 
              label="Assists" 
              value={playerStats?.total_assists || 0} 
              maxValue={15} 
              color="#00E676" 
            />
            <StatsBar 
              label="Team Rating" 
              value={playerStats?.avg_rating ? playerStats.avg_rating * 10 : 70} 
              maxValue={100} 
              color="#FFC107" 
            />
            <StatsBar 
              label="XP Level" 
              value={player.level || 1} 
              maxValue={30} 
              color="#E040FB" 
            />
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/team')}
          >
            <View style={[styles.actionIcon, styles.actionIconBlue]}>
              <Trophy size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Team Hub</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/stats')}
          >
            <View style={[styles.actionIcon, styles.actionIconGreen]}>
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Statistics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/team/chat')}
          >
            <View style={[styles.actionIcon, styles.actionIconPurple]}>
              <MessageCircle size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Team Chat</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Matches</Text>
          
          {recentMatches.length > 0 ? (
            recentMatches.map((match, index) => (
              <View key={index} style={styles.matchCard}>
                <View style={styles.matchDate}>
                  <Text style={styles.matchDateText}>
                    {new Date(match.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                </View>
                
                <View style={styles.matchDetails}>
                  <View style={styles.matchStat}>
                    <Text style={styles.matchStatLabel}>Goals</Text>
                    <Text style={styles.matchStatValue}>{match.goals}</Text>
                  </View>
                  
                  <View style={styles.matchStat}>
                    <Text style={styles.matchStatLabel}>Assists</Text>
                    <Text style={styles.matchStatValue}>{match.assists}</Text>
                  </View>
                  
                  <View style={styles.matchStat}>
                    <Text style={styles.matchStatLabel}>Rating</Text>
                    <Text style={[
                      styles.matchStatValue,
                      match.rating >= 8 ? styles.ratingHigh : 
                      match.rating >= 6 ? styles.ratingMedium : 
                      styles.ratingLow
                    ]}>
                      {match.rating.toFixed(1)}
                    </Text>
                  </View>
                  
                  <View style={styles.matchStat}>
                    <Text style={styles.matchStatLabel}>Minutes</Text>
                    <Text style={styles.matchStatValue}>{match.playtime_minutes}'</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noMatchesContainer}>
              <Text style={styles.noMatchesText}>No recent matches found</Text>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#BBBBBB',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F44336',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cardContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
  },
  playerCard: {
    width: 180,
    height: 270,
  },
  statsOverview: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  statItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#BBBBBB',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  performanceContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconBlue: {
    backgroundColor: '#1E88E5',
  },
  actionIconGreen: {
    backgroundColor: '#00C853',
  },
  actionIconPurple: {
    backgroundColor: '#7C4DFF',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  matchCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  matchDate: {
    backgroundColor: '#2A2A2A',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  matchDateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  matchDetails: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
  },
  matchStat: {
    flex: 1,
    alignItems: 'center',
  },
  matchStatLabel: {
    color: '#BBBBBB',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  matchStatValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  ratingHigh: {
    color: '#4CAF50',
  },
  ratingMedium: {
    color: '#FFC107',
  },
  ratingLow: {
    color: '#F44336',
  },
  noMatchesContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  noMatchesText: {
    color: '#BBBBBB',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});