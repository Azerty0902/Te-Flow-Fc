import { useState } from 'react';
import supabase from '../utils/supabase';
import { Database } from '../types/database.types';

type Stat = Database['public']['Tables']['stats']['Row'];

export default function useStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function fetchLeaderboard(stat: 'goals' | 'assists' | 'rating', limit = 10) {
    try {
      setLoading(true);
      
      // Build a summary query with player information
      const { data, error } = await supabase
        .from('player_stats_summary')
        .select(`
          player_id,
          total_${stat === 'rating' ? 'matches' : stat},
          avg_rating,
          players:player_id (
            id, 
            username, 
            full_name, 
            avatar_url, 
            team_id,
            position,
            jersey_number,
            teams:team_id (
              id,
              name,
              logo_url
            )
          )
        `)
        .order(stat === 'rating' ? 'avg_rating' : `total_${stat}`, { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  
  async function addPlayerStats(stat: Omit<Stat, 'id' | 'created_at'>) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stats')
        .insert(stat)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update player XP based on performance
      const xpGain = calculateXpGain(stat);
      if (xpGain > 0) {
        const { data: player, error: playerError } = await supabase
          .from('players')
          .select('xp_points, level')
          .eq('id', stat.player_id)
          .single();
          
        if (playerError) throw playerError;
        
        const newXp = (player.xp_points || 0) + xpGain;
        const newLevel = calculateLevel(newXp);
        
        const { error: updateError } = await supabase
          .from('players')
          .update({ 
            xp_points: newXp,
            level: newLevel 
          })
          .eq('id', stat.player_id);
          
        if (updateError) throw updateError;
      }
      
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  
  // Helper function to calculate XP gain from a match performance
  function calculateXpGain(stat: Partial<Stat>): number {
    let xp = 0;
    
    // Base XP for playing
    xp += 10;
    
    // XP for goals
    xp += (stat.goals || 0) * 15;
    
    // XP for assists
    xp += (stat.assists || 0) * 10;
    
    // XP for other contributions
    xp += (stat.passes || 0) * 0.1;
    xp += (stat.tackles || 0) * 0.5;
    xp += (stat.shots || 0) * 0.2;
    xp += (stat.saves || 0) * 0.5;
    
    // XP for playtime
    xp += (stat.playtime_minutes || 0) * 0.2;
    
    // XP bonus for good rating
    if (stat.rating && stat.rating > 7) {
      xp += (stat.rating - 7) * 10;
    }
    
    return Math.round(xp);
  }
  
  // Helper function to calculate level based on XP
  function calculateLevel(xp: number): number {
    // Simple level calculation: level = 1 + (xp / 100), rounded down
    return Math.floor(1 + (xp / 100));
  }

  return {
    loading,
    error,
    fetchLeaderboard,
    addPlayerStats,
  };
}