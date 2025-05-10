import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Play, Pause } from 'lucide-react-native';

type ChatMessageProps = {
  message: string;
  isVoice?: boolean;
  audioUrl?: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date | string;
  isMine?: boolean;
  style?: ViewStyle;
};

export default function ChatMessage({
  message,
  isVoice = false,
  audioUrl,
  senderName,
  senderAvatar,
  timestamp,
  isMine = false,
  style
}: ChatMessageProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  
  const formattedTime = typeof timestamp === 'string' 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const toggleAudio = () => {
    // Audio playback functionality would be implemented here
    setIsPlaying(!isPlaying);
  };
  
  return (
    <View style={[
      styles.container, 
      isMine ? styles.myMessageContainer : styles.otherMessageContainer,
      style
    ]}>
      {!isMine && (
        <View style={styles.avatarContainer}>
          {senderAvatar ? (
            <Image source={{ uri: senderAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Text style={styles.avatarInitial}>{senderName.charAt(0)}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={[
        styles.messageContent,
        isMine ? styles.myMessageContent : styles.otherMessageContent
      ]}>
        {!isMine && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        
        {isVoice ? (
          <View style={styles.audioContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={toggleAudio}
            >
              {isPlaying ? (
                <Pause size={20} color={isMine ? '#FFFFFF' : '#333333'} />
              ) : (
                <Play size={20} color={isMine ? '#FFFFFF' : '#333333'} />
              )}
            </TouchableOpacity>
            <View style={styles.audioWaveform}>
              {/* Audio waveform visualization would go here */}
              <View style={styles.waveformPlaceholder} />
            </View>
          </View>
        ) : (
          <Text style={[
            styles.messageText,
            isMine ? styles.myMessageText : styles.otherMessageText
          ]}>
            {message}
          </Text>
        )}
        
        <Text style={[
          styles.timestamp,
          isMine ? styles.myTimestamp : styles.otherTimestamp
        ]}>
          {formattedTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  placeholderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  messageContent: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  myMessageContent: {
    backgroundColor: '#1E88E5',
    borderBottomRightRadius: 4,
  },
  otherMessageContent: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#333333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 160,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  audioWaveform: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
  },
  waveformPlaceholder: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '100%',
    borderRadius: 1,
  },
});