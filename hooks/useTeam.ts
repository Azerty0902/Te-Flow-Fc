import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { Database } from '../types/database.types';

type Team = Database['public']['Tables']['teams']['Row'];
type Player = Database['public']['Tables']['players']['Row'];

export default function useTeam(teamId?: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!teamId) return;
    
    async function fetchTeam() {
      try {
        setLoading(true);
        
        // Fetch team data
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamId)
          .single();
          
        if (teamError) throw teamError;
        setTeam(teamData);
        
        // Fetch team players
        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('*')
          .eq('team_id', teamId);
          
        if (playersError) throw playersError;
        setTeamPlayers(playersData || []);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTeam();
  }, [teamId]);
  
  async function fetchTeamMessages(limit = 20) {
    try {
      if (!teamId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          created_at,
          content,
          is_voice,
          audio_url,
          players:sender_id (id, username, avatar_url)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  }
  
  async function sendMessage(content: string, senderId: string, isVoice = false, audioUrl = null) {
    try {
      if (!teamId) return null;
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          team_id: teamId,
          sender_id: senderId,
          content,
          is_voice: isVoice,
          audio_url: audioUrl,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  }
  
  return {
    team,
    teamPlayers,
    loading,
    error,
    fetchTeamMessages,
    sendMessage
  };
}