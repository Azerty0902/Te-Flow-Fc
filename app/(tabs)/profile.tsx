import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Pencil, LogOut, ChevronRight, Settings, Award, Shield, Bell } from 'lucide-react-native';
import useAuth from '@/hooks/useAuth';
import usePlayer from '@/hooks/usePlayer';
import FootballCard from '@/components/FootballCard';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const { player, playerStats, loading, error, updatePlayer } = usePlayer(session?.user.id);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)');
          },
        },
      ],
    );
  };
  
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('/profile/edit')}
        >
          <Pencil size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {player.avatar_url ? (
              <Image source={{ uri: player.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {(player.full_name || player.username)?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.playerName}>{player.full_name || player.username}</Text>
            
            <View style={styles.playerDetails}>
              {player.position && (
                <View style={styles.detailTag}>
                  <Text style={styles.detailTagText}>{player.position}</Text>
                </View>
              )}
              
              {player.jersey_number && (
                <View style={styles.detailTag}>
                  <Text style={styles.detailTagText}>#{player.jersey_number}</Text>
                </View>
              )}
              
              <View style={styles.levelTag}>
                <Text style={styles.levelTagText}>Lvl {player.level || 1}</Text>
              </View>
            </View>
            
            <View style={styles.xpContainer}>
              <View style={styles.xpBar}>
                <View 
                  style={[
                    styles.xpFill, 
                    { width: `${(player.xp_points % 100) || 0}%` }
                  ]} 
                />
              </View>
              <Text style={styles.xpText}>
                {player.xp_points || 0} XP
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Player Card</Text>
          
          <View style={styles.cardContainer}>
            <FootballCard
              playerName={player.full_name || player.username}
              position={player.position || 'ST'}
              stats={cardStats}
              imageUrl={player.avatar_url || undefined}
              cardType={player.level >= 15 ? 'special' :
                        player.level >= 10 ? 'gold' :
                        player.level >= 5 ? 'silver' : 'bronze'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Career Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{playerStats?.total_matches || 0}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{playerStats?.total_goals || 0}</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{playerStats?.total_assists || 0}</Text>
              <Text style={styles.statLabel}>Assists</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {playerStats?.avg_rating ? playerStats.avg_rating.toFixed(1) : '0.0'}
              </Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsSection}>
            <TouchableOpacity style={styles.settingsRow}>
              <View style={styles.settingsIconContainer}>
                <Bell size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.settingsLabel}>Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#4A4A4A', true: '#1E88E5' }}
                thumbColor={'#FFFFFF'}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsRow}
              onPress={() => router.push('/profile/achievements')}
            >
              <View style={styles.settingsIconContainer}>
                <Award size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.settingsLabel}>Achievements</Text>
              <ChevronRight size={20} color="#BBBBBB" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsRow}
              onPress={() => router.push('/profile/privacy')}
            >
              <View style={styles.settingsIconContainer}>
                <Shield size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.settingsLabel}>Privacy</Text>
              <ChevronRight size={20} color="#BBBBBB" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsRow}
              onPress={() => router.push('/profile/settings')}
            >
              <View style={styles.settingsIconContainer}>
                <Settings size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.settingsLabel}>App Settings</Text>
              <ChevronRight size={20} color="#BBBBBB" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <LogOut size={20} color="#F44336" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  editButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  playerDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailTag: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
  },
  detailTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  levelTag: {
    backgroundColor: '#1E88E5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  levelTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  xpContainer: {
    width: '100%',
  },
  xpBar: {
    height: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 3,
    marginBottom: 4,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#00E676',
    borderRadius: 3,
  },
  xpText: {
    color: '#BBBBBB',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  cardContainer: {
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  settingsSection: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  settingsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsLabel: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  signOutText: {
    color: '#F44336',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
});