import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react-native';

type TransferCardProps = {
  playerName: string;
  playerPosition?: string;
  fromTeam?: string;
  toTeam: string;
  value: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  canRespond?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function TransferCard({
  playerName,
  playerPosition,
  fromTeam,
  toTeam,
  value,
  status,
  message,
  canRespond = false,
  onAccept,
  onReject,
  onPress,
  style
}: TransferCardProps) {
  // Format currency
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
  
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'accepted': return '#4CAF50';
      case 'rejected': return '#F44336';
      default: return '#FF9800';
    }
  };
  
  // Get status text
  const getStatusText = () => {
    switch (status) {
      case 'accepted': return 'Transfer Accepted';
      case 'rejected': return 'Transfer Rejected';
      default: return 'Pending Approval';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.playerName}>{playerName}</Text>
        {playerPosition && (
          <Text style={styles.playerPosition}>{playerPosition}</Text>
        )}
      </View>
      
      <View style={styles.transferDetails}>
        {fromTeam && (
          <Text style={styles.teamText}>{fromTeam}</Text>
        )}
        
        <View style={styles.arrowContainer}>
          <ArrowRight color="#FFFFFF" size={16} />
        </View>
        
        <Text style={styles.teamText}>{toTeam}</Text>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={styles.valueLabel}>Transfer Value:</Text>
        <Text style={styles.valueAmount}>{formattedValue}</Text>
      </View>
      
      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText} numberOfLines={2}>{message}</Text>
        </View>
      )}
      
      <View style={styles.footer}>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        
        {canRespond && status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={onAccept}
            >
              <CheckCircle size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={onReject}
            >
              <XCircle size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerPosition: {
    fontSize: 14,
    color: '#BBBBBB',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  transferDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  teamText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  arrowContainer: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginHorizontal: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  valueLabel: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  valueAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#DDDDDD',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 4,
  },
});