import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, RefreshCw, PlusCircle, Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import usePlayer from '@/hooks/usePlayer';
import useTransfers from '@/hooks/useTransfers';
import TransferCard from '@/components/TransferCard';
import PlayerListItem from '@/components/PlayerListItem';

export default function TransfersScreen() {
  const { session } = useAuth();
  const { player } = usePlayer(session?.user.id);
  const { fetchPlayerTransfers, fetchTeamTransfers, updateTransferStatus, loading } = useTransfers();
  
  const [activeTab, setActiveTab] = useState('market');
  const [searchQuery, setSearchQuery] = useState('');
  const [transfers, setTransfers] = useState<any[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  
  useEffect(() => {
    if (player?.id) {
      loadTransfers();
    }
  }, [player, activeTab]);
  
  const loadTransfers = async () => {
    try {
      if (activeTab === 'mine') {
        const data = await fetchPlayerTransfers(player.id);
        setTransfers(data || []);
      } else if (activeTab === 'team' && player.team_id) {
        const data = await fetchTeamTransfers(player.team_id);
        setTransfers(data || []);
      } else {
        // In a real app, you would fetch the actual transfer market listings
        // For now, let's create some dummy data
        setTransfers([
          {
            id: '1',
            player_id: '101',
            from_team_id: '201',
            to_team_id: '202',
            status: 'pending',
            value: 150000,
            message: 'Interested in this promising striker',
            players: {
              full_name: 'John Smith',
              username: 'johnsmith',
              position: 'ST',
            },
            from_team: {
              name: 'FC Barcelona'
            },
            to_team: {
              name: 'Real Madrid'
            }
          },
          {
            id: '2',
            player_id: '102',
            from_team_id: '203',
            to_team_id: '204',
            status: 'pending',
            value: 125000,
            message: 'Looking for a solid midfielder',
            players: {
              full_name: 'James Wilson',
              username: 'jameswilson',
              position: 'CM',
            },
            from_team: {
              name: 'Manchester United'
            },
            to_team: {
              name: 'Liverpool'
            }
          },
          {
            id: '3',
            player_id: '103',
            from_team_id: '205',
            to_team_id: '206',
            status: 'accepted',
            value: 200000,
            message: 'Great defender with excellent passing',
            players: {
              full_name: 'David Thompson',
              username: 'davidthompson',
              position: 'CB',
            },
            from_team: {
              name: 'Bayern Munich'
            },
            to_team: {
              name: 'PSG'
            }
          }
        ]);
      }
      
      // In a real app, you would fetch available players from your API
      setAvailablePlayers([
        {
          id: '201',
          full_name: 'Michael Johnson',
          username: 'mjohnson',
          position: 'LW',
          jersey_number: 11,
          team_id: '301',
          avatar_url: '',
          team: { name: 'Chelsea FC' }
        },
        {
          id: '202',
          full_name: 'Robert Garcia',
          username: 'rgarcia',
          position: 'RB',
          jersey_number: 2,
          team_id: '302',
          avatar_url: '',
          team: { name: 'Arsenal FC' }
        },
        {
          id: '203',
          full_name: 'Thomas Miller',
          username: 'tmiller',
          position: 'CDM',
          jersey_number: 6,
          team_id: '303',
          avatar_url: '',
          team: { name: 'AC Milan' }
        }
      ]);
      
    } catch (err) {
      console.error('Error loading transfers:', err);
    }
  };
  
  const handleAcceptTransfer = async (transferId: string) => {
    try {
      await updateTransferStatus(transferId, 'accepted');
      // Reload transfers after update
      loadTransfers();
    } catch (err) {
      console.error('Error accepting transfer:', err);
    }
  };
  
  const handleRejectTransfer = async (transferId: string) => {
    try {
      await updateTransferStatus(transferId, 'rejected');
      // Reload transfers after update
      loadTransfers();
    } catch (err) {
      console.error('Error rejecting transfer:', err);
    }
  };
  
  const filterTransfers = () => {
    if (!searchQuery) return transfers;
    
    return transfers.filter(transfer => 
      transfer.players.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.players.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.from_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.to_team?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const filterPlayers = () => {
    if (!searchQuery) return availablePlayers;
    
    return availablePlayers.filter(player => 
      player.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transfer Market</Text>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'market' && styles.activeTab]}
          onPress={() => setActiveTab('market')}
        >
          <RefreshCw 
            size={18} 
            color={activeTab === 'market' ? '#FFFFFF' : '#BBBBBB'} 
          />
          <Text style={[styles.tabText, activeTab === 'market' && styles.activeTabText]}>
            Market
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'team' && styles.activeTab]}
          onPress={() => setActiveTab('team')}
        >
          <Text style={[styles.tabText, activeTab === 'team' && styles.activeTabText]}>
            Team Transfers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mine' && styles.activeTab]}
          onPress={() => setActiveTab('mine')}
        >
          <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
            My Transfers
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#BBBBBB" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players, teams..."
            placeholderTextColor="#777777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'market' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Players</Text>
              
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => router.push('/transfers/create')}
              >
                <PlusCircle size={16} color="#1E88E5" />
                <Text style={styles.createButtonText}>Create Offer</Text>
              </TouchableOpacity>
            </View>
            
            {filterPlayers().map((playerItem) => (
              <PlayerListItem
                key={playerItem.id}
                name={playerItem.full_name}
                avatarUrl={playerItem.avatar_url}
                position={playerItem.position}
                jerseyNumber={playerItem.jersey_number}
                onPress={() => router.push(`/transfers/player/${playerItem.id}`)}
              />
            ))}
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Current Offers</Text>
            </View>
            
            {filterTransfers().map((transfer) => (
              <TransferCard
                key={transfer.id}
                playerName={transfer.players.full_name || transfer.players.username}
                playerPosition={transfer.players.position}
                fromTeam={transfer.from_team?.name}
                toTeam={transfer.to_team?.name}
                value={transfer.value}
                status={transfer.status}
                message={transfer.message}
                canRespond={player?.team_id === transfer.from_team_id && player?.id === player?.team?.captain_id}
                onAccept={() => handleAcceptTransfer(transfer.id)}
                onReject={() => handleRejectTransfer(transfer.id)}
                onPress={() => router.push(`/transfers/${transfer.id}`)}
              />
            ))}
          </View>
        )}
        
        {activeTab === 'team' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Team Transfer Activity</Text>
            </View>
            
            {player?.team_id ? (
              filterTransfers().length > 0 ? (
                filterTransfers().map((transfer) => (
                  <TransferCard
                    key={transfer.id}
                    playerName={transfer.players.full_name || transfer.players.username}
                    playerPosition={transfer.players.position}
                    fromTeam={transfer.from_team?.name}
                    toTeam={transfer.to_team?.name}
                    value={transfer.value}
                    status={transfer.status}
                    message={transfer.message}
                    canRespond={player?.team_id === transfer.from_team_id && player?.id === player?.team?.captain_id}
                    onAccept={() => handleAcceptTransfer(transfer.id)}
                    onReject={() => handleRejectTransfer(transfer.id)}
                    onPress={() => router.push(`/transfers/${transfer.id}`)}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No team transfers found</Text>
                </View>
              )
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>You need to join a team first</Text>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'mine' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Transfer Activity</Text>
            </View>
            
            {filterTransfers().length > 0 ? (
              filterTransfers().map((transfer) => (
                <TransferCard
                  key={transfer.id}
                  playerName={transfer.players.full_name || transfer.players.username}
                  playerPosition={transfer.players.position}
                  fromTeam={transfer.from_team?.name}
                  toTeam={transfer.to_team?.name}
                  value={transfer.value}
                  status={transfer.status}
                  message={transfer.message}
                  canRespond={false}
                  onPress={() => router.push(`/transfers/${transfer.id}`)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No personal transfers found</Text>
              </View>
            )}
          </View>
        )}
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#1E88E5',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
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
});