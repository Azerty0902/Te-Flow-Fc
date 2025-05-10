import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Star } from 'lucide-react-native';

type PlayerListItemProps = {
  name: string;
  avatarUrl?: string;
  position?: string;
  jerseyNumber?: number;
  rating?: number;
  stats?: {
    goals?: number;
    assists?: number;
  };
  onPress?: () => void;
  style?: ViewStyle;
};

export default function PlayerListItem({
  name,
  avatarUrl,
  position,
  jerseyNumber,
  rating,
  stats,
  onPress,
  style
}: PlayerListItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.avatarInitial}>{name.charAt(0)}</Text>
          </View>
        )}
        
        {jerseyNumber !== undefined && (
          <View style={styles.jerseyNumberContainer}>
            <Text style={styles.jerseyNumber}>{jerseyNumber}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.playerName} numberOfLines={1}>{name}</Text>
        {position && <Text style={styles.position}>{position}</Text>}
      </View>
      
      <View style={styles.statsContainer}>
        {rating !== undefined && (
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          </View>
        )}
        
        {stats && (
          <View style={styles.statsRow}>
            {stats.goals !== undefined && (
              <Text style={styles.statText}>{stats.goals} G</Text>
            )}
            {stats.assists !== undefined && (
              <Text style={styles.statText}>{stats.assists} A</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  jerseyNumberContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  jerseyNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  position: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginLeft: 8,
  },
});