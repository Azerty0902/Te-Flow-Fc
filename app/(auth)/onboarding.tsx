import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Upload, ChevronRight } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import supabase from '@/utils/supabase';
import useAuth from '@/hooks/useAuth';

const positions = [
  'GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'
];

export default function OnboardingScreen() {
  const { session } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [position, setPosition] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to take a photo');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const completeProfile = async () => {
    if (!fullName || !username) {
      Alert.alert('Missing information', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      let avatarUrl = '';
      
      // Upload avatar if selected
      if (avatarUri) {
        const fileExt = avatarUri.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        // Convert URI to Blob
        const response = await fetch(avatarUri);
        const blob = await response.blob();
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('player-avatars')
          .upload(filePath, blob);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('player-avatars')
          .getPublicUrl(filePath);
          
        avatarUrl = data.publicUrl;
      }
      
      // Update player profile
      const { error } = await supabase
        .from('players')
        .update({
          full_name: fullName,
          username,
          position: position || null,
          jersey_number: jerseyNumber ? parseInt(jerseyNumber, 10) : null,
          avatar_url: avatarUrl || null,
        })
        .eq('id', session?.user.id);
        
      if (error) throw error;
      
      // Redirect to main app
      router.replace('/(tabs)');
      
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Let's set up your player card</Text>
      </View>
      
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Camera size={40} color="#FFFFFF" />
            </View>
          )}
        </View>
        
        <View style={styles.avatarButtons}>
          <TouchableOpacity 
            style={styles.avatarButton}
            onPress={takePhoto}
          >
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.avatarButtonText}>Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.avatarButton}
            onPress={pickImage}
          >
            <Upload size={20} color="#FFFFFF" />
            <Text style={styles.avatarButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#777777"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username *</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor="#777777"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Position</Text>
            <View style={styles.positionInputContainer}>
              <TextInput
                style={[styles.input, { paddingRight: 50 }]}
                placeholder="e.g. ST"
                placeholderTextColor="#777777"
                value={position}
                onChangeText={setPosition}
                autoCapitalize="characters"
                maxLength={3}
              />
              
              <View style={styles.positionTips}>
                {positions.slice(0, 4).map((pos) => (
                  <TouchableOpacity 
                    key={pos} 
                    style={styles.positionChip}
                    onPress={() => setPosition(pos)}
                  >
                    <Text style={styles.positionChipText}>{pos}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Jersey #</Text>
            <TextInput
              style={styles.input}
              placeholder="Number"
              placeholderTextColor="#777777"
              value={jerseyNumber}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setJerseyNumber(numericValue);
              }}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.submitButton}
          onPress={completeProfile}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            Complete Profile
          </Text>
          <ChevronRight color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardPreviewContainer}>
        <Text style={styles.cardPreviewTitle}>Your Player Card Preview</Text>
        <LinearGradient
          colors={['#FFD700', '#FFF9C4', '#FFD700']}
          style={styles.cardPreview}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardRating}>
              <Text style={styles.ratingText}>75</Text>
              <Text style={styles.positionText}>{position || 'ST'}</Text>
            </View>
          </View>
          
          <View style={styles.cardImageContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.cardImage} />
            ) : (
              <View style={styles.cardImagePlaceholder} />
            )}
          </View>
          
          <View style={styles.cardNameContainer}>
            <Text style={styles.cardName} numberOfLines={1}>
              {fullName || 'YOUR NAME'}
            </Text>
          </View>
          
          <View style={styles.cardStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>PAC</Text>
              <Text style={styles.statValue}>75</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>SHO</Text>
              <Text style={styles.statValue}>70</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>PAS</Text>
              <Text style={styles.statValue}>72</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>DRI</Text>
              <Text style={styles.statValue}>76</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>DEF</Text>
              <Text style={styles.statValue}>50</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>PHY</Text>
              <Text style={styles.statValue}>68</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#BBBBBB',
    marginTop: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#2A2A2A',
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
  },
  avatarButtons: {
    flexDirection: 'row',
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  avatarButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  formContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  positionInputContainer: {
    position: 'relative',
  },
  positionTips: {
    position: 'absolute',
    right: 8,
    top: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 100,
  },
  positionChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  positionChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  cardPreviewContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  cardPreviewTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  cardPreview: {
    width: 220,
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  cardRating: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  positionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  cardImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cardNameContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  cardStats: {
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
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
});