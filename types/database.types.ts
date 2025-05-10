export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          created_at: string
          email: string
          username: string
          full_name: string
          avatar_url: string
          team_id: string | null
          position: string | null
          jersey_number: number | null
          xp_points: number
          level: number
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          username: string
          full_name: string
          avatar_url?: string
          team_id?: string | null
          position?: string | null
          jersey_number?: number | null
          xp_points?: number
          level?: number
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          username?: string
          full_name?: string
          avatar_url?: string
          team_id?: string | null
          position?: string | null
          jersey_number?: number | null
          xp_points?: number
          level?: number
        }
      }
      teams: {
        Row: {
          id: string
          created_at: string
          name: string
          logo_url: string | null
          description: string | null
          captain_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          logo_url?: string | null
          description?: string | null
          captain_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          logo_url?: string | null
          description?: string | null
          captain_id?: string | null
        }
      }
      stats: {
        Row: {
          id: string
          created_at: string
          player_id: string
          match_id: string | null
          goals: number
          assists: number
          passes: number
          tackles: number
          shots: number
          saves: number
          playtime_minutes: number
          rating: number
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          player_id: string
          match_id?: string | null
          goals?: number
          assists?: number
          passes?: number
          tackles?: number
          shots?: number
          saves?: number
          playtime_minutes?: number
          rating?: number
          date: string
        }
        Update: {
          id?: string
          created_at?: string
          player_id?: string
          match_id?: string | null
          goals?: number
          assists?: number
          passes?: number
          tackles?: number
          shots?: number
          saves?: number
          playtime_minutes?: number
          rating?: number
          date?: string
        }
      }
      transfers: {
        Row: {
          id: string
          created_at: string
          player_id: string
          from_team_id: string | null
          to_team_id: string
          status: 'pending' | 'accepted' | 'rejected'
          value: number
          message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          player_id: string
          from_team_id?: string | null
          to_team_id: string
          status?: 'pending' | 'accepted' | 'rejected'
          value: number
          message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          player_id?: string
          from_team_id?: string | null
          to_team_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          value?: number
          message?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          team_id: string
          sender_id: string
          content: string
          is_voice: boolean
          audio_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          team_id: string
          sender_id: string
          content: string
          is_voice?: boolean
          audio_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          team_id?: string
          sender_id?: string
          content?: string
          is_voice?: boolean
          audio_url?: string | null
        }
      }
    }
    Views: {
      player_stats_summary: {
        Row: {
          player_id: string
          total_goals: number
          total_assists: number
          total_matches: number
          avg_rating: number
          total_xp: number
        }
      }
    }
  }
}