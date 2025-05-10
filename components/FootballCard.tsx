import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Platform, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Stats = {
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physical?: number;
  overall?: number;
};

type CardProps = {
  playerName: string;
  position?: string;
  nationality?: string;
  club?: string;
  stats: Stats;
  imageUrl?: string;
  cardType?: 'bronze' | 'silver' | 'gold' | 'special';
  style?: ViewStyle;
};

const getCardColors = (cardType: string) => {
  switch (cardType) {
    case 'bronze':
      return ['#CD7F32', '#E1A66C', '#CD7F32'];
    case 'silver':
      return ['#C0C0C0', '#E6E6E6', '#C0C0C0'];
    case 'gold':
      return ['#FFD700', '#FFF9C4', '#FFD700'];
    case 'special':
      return ['#FF5252', '#FF1744', '#D50000'];
    default:
      return ['#FFD700', '#FFF9C4', '#FFD700'];
  }
};

export default function FootballCard({
  playerName,
  position = 'ST',
  nationality = '',
  club = '',
  stats,
  imageUrl,
  cardType = 'gold',
  style
}: CardProps) {
  const cardColors = getCardColors(cardType);
  const overall = stats.overall || 
    Math.floor((stats.pace || 70) * 0.2 + 
    (stats.shooting || 65) * 0.2 + 
    (stats.passing || 65) * 0.2 + 
    (stats.dribbling || 65) * 0.2 + 
    (stats.defending || 50) * 0.1 + 
    (stats.physical || 60) * 0.1);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={cardColors}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{overall}</Text>
            <Text style={styles.position}>{position}</Text>
          </View>
          
          {nationality ? (
            <View style={styles.flagContainer}>
              <Text style={styles.nationalityText}>{nationality}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.playerImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.playerName} numberOfLines={1}>
            {playerName}
          </Text>
          {club ? <Text style={styles.clubName}>{club}</Text> : null}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>PAC</Text>
            <Text style={styles.statValue}>{stats.pace || 70}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>SHO</Text>
            <Text style={styles.statValue}>{stats.shooting || 65}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>PAS</Text>
            <Text style={styles.statValue}>{stats.passing || 65}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>DRI</Text>
            <Text style={styles.statValue}>{stats.dribbling || 65}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>DEF</Text>
            <Text style={styles.statValue}>{stats.defending || 50}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>PHY</Text>
            <Text style={styles.statValue}>{stats.physical || 60}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  rating: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  position: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  flagContainer: {
    width: 40,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  nationalityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerImage: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 60,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  clubName: {
    fontSize: 14,
    color: '#1A1A1A',
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statRow: {
    flexDirection: 'row',
    width: '30%',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
});