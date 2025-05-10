import { useState } from 'react';
import supabase from '../utils/supabase';
import { Database } from '../types/database.types';

type Transfer = Database['public']['Tables']['transfers']['Row'];

export default function useTransfers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function fetchPlayerTransfers(playerId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transfers')
        .select(`
          *,
          players:player_id (*),
          from_team:from_team_id (*),
          to_team:to_team_id (*)
        `)
        .eq('player_id', playerId);
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchTeamTransfers(teamId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transfers')
        .select(`
          *,
          players:player_id (*),
          from_team:from_team_id (*),
          to_team:to_team_id (*)
        `)
        .or(`from_team_id.eq.${teamId},to_team_id.eq.${teamId}`);
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  
  async function createTransferOffer(transfer: Omit<Transfer, 'id' | 'created_at'>) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transfers')
        .insert(transfer)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  
  async function updateTransferStatus(transferId: string, status: 'accepted' | 'rejected') {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transfers')
        .update({ status })
        .eq('id', transferId)
        .select()
        .single();
        
      if (error) throw error;
      
      // If transfer is accepted, update the player's team
      if (status === 'accepted') {
        const { to_team_id, player_id } = data;
        const { error: playerUpdateError } = await supabase
          .from('players')
          .update({ team_id: to_team_id })
          .eq('id', player_id);
          
        if (playerUpdateError) throw playerUpdateError;
      }
      
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    fetchPlayerTransfers,
    fetchTeamTransfers,
    createTransferOffer,
    updateTransferStatus,
  };
}