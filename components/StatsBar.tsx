import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type StatsBarProps = {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  style?: ViewStyle;
};

export default function StatsBar({
  label,
  value,
  maxValue = 100,
  color = '#4CAF50',
  style
}: StatsBarProps) {
  // Calculate the percentage
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.barBackground}>
        <View 
          style={[
            styles.barFill, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E0E0E0',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  barBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});