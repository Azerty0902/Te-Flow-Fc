import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ArrowRight } from 'lucide-react-native';

type TeamCardProps = {
  name: string;
  logoUrl?: string;
  playerCount: number;
  ranking?: number;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function TeamCard({
  name,
  logoUrl,
  playerCount,
  ranking,
  onPress,
  style
}: TeamCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.logoContainer}>
        {logoUrl ? (
          <Image source={{ uri: logoUrl }} style={styles.logo} />
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.logoInitial}>{name.charAt(0)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.teamName} numberOfLines={1}>{name}</Text>
        <Text style={styles.playerCount}>{playerCount} Players</Text>
        {ranking ? (
          <Text style={styles.ranking}>Ranking: #{ranking}</Text>
        ) : null}
      </View>
      
      <View style={styles.arrowContainer}>
        <ArrowRight color="#FFFFFF" size={20} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  playerCount: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  ranking: {
    fontSize: 14,
    color: '#00E676',
    fontWeight: '500',
  },
  arrowContainer: {
    padding: 8,
  },
});