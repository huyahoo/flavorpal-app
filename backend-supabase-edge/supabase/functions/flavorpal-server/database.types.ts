export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          created_at: string
          id: number
          opinion: string | null
          product_id: number
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          opinion?: string | null
          product_id: number
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          opinion?: string | null
          product_id?: number
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_interactions_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "ai_suggestions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_suggestions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "reviews_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "ai_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reviews_view"
            referencedColumns: ["reviewer_id"]
          },
        ]
      }
      badges: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      history: {
        Row: {
          created_at: string
          id: number
          product_id: number
          text_content: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          product_id: number
          text_content?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number
          text_content?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_interactions_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "reviews_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reviews_view"
            referencedColumns: ["reviewer_id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brands: string | null
          categories: string | null
          created_at: string
          generic_name: string | null
          id: number
          image_embedding: string | null
          image_url: string | null
          ingredients: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          brands?: string | null
          categories?: string | null
          created_at?: string
          generic_name?: string | null
          id?: number
          image_embedding?: string | null
          image_url?: string | null
          ingredients?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          brands?: string | null
          categories?: string | null
          created_at?: string
          generic_name?: string | null
          id?: number
          image_embedding?: string | null
          image_url?: string | null
          ingredients?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: number
          likes_count: number
          note: string | null
          product_id: number
          rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          likes_count?: number
          note?: string | null
          product_id: number
          rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          likes_count?: number
          note?: string | null
          product_id?: number
          rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_interactions_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "reviews_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reviews_view"
            referencedColumns: ["reviewer_id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: number | null
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          badge_id?: number | null
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          badge_id?: number | null
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reviews_view"
            referencedColumns: ["reviewer_id"]
          },
        ]
      }
    }
    Views: {
      product_interactions_view: {
        Row: {
          ai_opinion: string | null
          ai_reason: string | null
          barcode: string | null
          brands: string | null
          categories: string | null
          date_reviewed: string | null
          date_scanned: string | null
          image_url: string | null
          is_reviewed: boolean | null
          likes_count: number | null
          name: string | null
          product_id: number | null
          user_note: string | null
          user_rating: number | null
        }
        Relationships: []
      }
      reviews_view: {
        Row: {
          ai_health_opinion: string | null
          ai_health_reason: string | null
          date_reviewed: string | null
          likes_count: number | null
          product_barcode: string | null
          product_brands: string | null
          product_id: number | null
          product_image_url: string | null
          product_name: string | null
          review_id: number | null
          review_note: string | null
          review_rating: number | null
          reviewer_id: string | null
          reviewer_metadata: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      search_similar_products: {
        Args: { query_vector: string; min_similarity?: number }
        Returns: {
          id: number
          image_embedding: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

