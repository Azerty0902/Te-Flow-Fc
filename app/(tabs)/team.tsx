import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, PlusCircle, Users } from 'lucide-react-native';
import useAuth from '@/hooks/useAuth';
import usePlayer from '@/hooks/usePlayer';
import useTeam from '@/hooks/useTeam';
import PlayerListItem from '@/components/PlayerListItem';
import TeamCard from '@/components/TeamCard';

export default function TeamScreen() {
  const { session } = useAuth();
  const { player, loading: playerLoading } = usePlayer(session?.user.id);
  const { team, teamPlayers, loading: teamLoading } = useTeam(player?.team_id);
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = () => {
    setRefreshing(true);
    // Reload data here
    setTimeout(() => setRefreshing(false), 1000);
  };
  
  // Show a loading state while both player and team data are loading
  if (playerLoading || teamLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading team information...</Text>
      </View>
    );
  }
  
  // If player doesn't have a team yet
  if (!player?.team_id || !team) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Team</Text>
        </View>
        
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
          <View style={styles.noTeamContainer}>
            <View style={styles.noTeamIcon}>
              <Users size={64} color="#AAAAAA" />
            </View>
            <Text style={styles.noTeamTitle}>No Team Yet</Text>
            <Text style={styles.noTeamText}>
              You aren't part of any team yet. Join an existing team or create your own.
            </Text>
            
            <View style={styles.noTeamActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => router.push('/team/join')}
              >
                <Text style={styles.primaryButtonText}>Join Team</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => router.push('/team/create')}
              >
                <Text style={styles.secondaryButtonText}>Create Team</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.teamsExploreSection}>
              <Text style={styles.exploreSectionTitle}>Teams to Explore</Text>
              
              <TeamCard 
                name="FC Barcelona" 
                playerCount={18} 
                ranking={1}
                onPress={() => {}} 
              />
              
              <TeamCard 
                name="FC Bayern Munich" 
                playerCount={16} 
                ranking={2}
                onPress={() => {}} 
              />
              
              <TeamCard 
                name="Liverpool FC" 
                playerCount={14} 
                ranking={3}
                onPress={() => {}} 
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
  
  // If player has a team
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Team</Text>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => router.push('/team/chat')}
        >
          <MessageCircle size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
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
        <View style={styles.teamInfoCard}>
          <View style={styles.teamHeader}>
            <View style={styles.teamLogoContainer}>
              {team.logo_url ? (
                <Image source={{ uri: team.logo_url }} style={styles.teamLogo} />
              ) : (
                <View style={styles.teamLogoPlaceholder}>
                  <Text style={styles.teamLogoText}>{team.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamPlayerCount}>{teamPlayers.length} Players</Text>
              {team.description && (
                <Text style={styles.teamDescription} numberOfLines={2}>
                  {team.description}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.teamActions}>
            <TouchableOpacity style={styles.teamActionButton}>
              <Text style={styles.teamActionText}>Team Stats</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.teamActionButton}
              onPress={() => router.push('/team/settings')}
            >
              <Text style={styles.teamActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Team Players</Text>
            <TouchableOpacity 
              style={styles.inviteButton}
              onPress={() => router.push('/team/invite')}
            >
              <PlusCircle size={16} color="#1E88E5" />
              <Text style={styles.inviteButtonText}>Invite</Text>
            </TouchableOpacity>
          </View>
          
          {teamPlayers.map((teamPlayer) => (
            <PlayerListItem
              key={teamPlayer.id}
              name={teamPlayer.full_name || teamPlayer.username}
              avatarUrl={teamPlayer.avatar_url}
              position={teamPlayer.position}
              jerseyNumber={teamPlayer.jersey_number}
              onPress={() => router.push(`/player/${teamPlayer.id}`)}
            />
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Schedule</Text>
          
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleEmptyText}>
              No upcoming matches scheduled yet.
            </Text>
            
            {player.id === team.captain_id && (
              <TouchableOpacity style={styles.scheduleActionButton}>
                <Text style={styles.scheduleActionText}>
                  Schedule a Match
                </Text>
              </TouchableOpacity>
            )}
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
  chatButton: {
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
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  noTeamContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  noTeamIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  noTeamTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  noTeamText: {
    color: '#BBBBBB',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  noTeamActions: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: '#1E88E5',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  secondaryButton: {
    backgroundColor: '#2A2A2A',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  teamsExploreSection: {
    width: '100%',
  },
  exploreSectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  teamInfoCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 24,
  },
  teamHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  teamLogoContainer: {
    marginRight: 16,
  },
  teamLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A2A2A',
  },
  teamLogoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamLogoText: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  teamInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  teamPlayerCount: {
    color: '#BBBBBB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  teamDescription: {
    color: '#EEEEEE',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  teamActions: {
    flexDirection: 'row',
  },
  teamActionButton: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  teamActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
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
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#1E88E5',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  scheduleCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  scheduleEmptyText: {
    color: '#BBBBBB',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  scheduleActionButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  scheduleActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});