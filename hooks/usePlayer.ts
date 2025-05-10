import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { Database } from '../types/database.types';

type Player = Database['public']['Tables']['players']['Row'];
type PlayerStats = Database['public']['Views']['player_stats_summary']['Row'];

export default function usePlayer(playerId?: string) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!playerId) return;
    
    async function fetchPlayer() {
      try {
        setLoading(true);
        
        // Fetch player data
        const { data: playerData, error: playerError } = await supabase
          .from('players')
          .select('*')
          .eq('id', playerId)
          .single();
          
        if (playerError) throw playerError;
        setPlayer(playerData);
        
        // Fetch player stats summary
        const { data: statsData, error: statsError } = await supabase
          .from('player_stats_summary')
          .select('*')
          .eq('player_id', playerId)
          .single();
          
        if (statsError && statsError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - might be a new player with no stats
          throw statsError;
        }
        
        setPlayerStats(statsData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPlayer();
  }, [playerId]);
  
  async function updatePlayer(updates: Partial<Player>) {
    try {
      if (!playerId) return;
      
      const { data, error } = await supabase
        .from('players')
        .update(updates)
        .eq('id', playerId)
        .select()
        .single();
        
      if (error) throw error;
      setPlayer(data);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  }
  
  async function fetchPlayerMatches(limit = 5) {
    try {
      if (!playerId) return [];
      
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .eq('player_id', playerId)
        .order('date', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  }
  
  return {
    player,
    playerStats,
    loading,
    error,
    updatePlayer,
    fetchPlayerMatches
  };
}