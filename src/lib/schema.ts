export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      movies: {
        Row: {
          current_list: string
          id: number
          overview: string
          popularity: number
          poster_path: string
          release_date: string
          title: string
        }
        Insert: {
          current_list?: string
          id?: number
          overview?: string
          popularity: number
          poster_path?: string
          release_date?: string
          title?: string
        }
        Update: {
          current_list?: string
          id?: number
          overview?: string
          popularity?: number
          poster_path?: string
          release_date?: string
          title?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
