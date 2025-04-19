export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_super_admin: boolean
        }
        Insert: {
          created_at?: string
          id: string
          is_super_admin?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          is_super_admin?: boolean
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_email: string
          author_name: string
          content: string
          created_at: string
          id: string
          is_approved: boolean
          post_id: string
        }
        Insert: {
          author_email: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean
          post_id: string
        }
        Update: {
          author_email?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          author_name: string
          content: string
          excerpt: string
          featured_image: string | null
          id: string
          is_published: boolean
          published_at: string
          read_time: number
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          author_name: string
          content: string
          excerpt: string
          featured_image?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          read_time?: number
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          author_name?: string
          content?: string
          excerpt?: string
          featured_image?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          read_time?: number
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_tags: {
        Row: {
          id: string
          name: string
          post_count: number
          slug: string
        }
        Insert: {
          id?: string
          name: string
          post_count?: number
          slug: string
        }
        Update: {
          id?: string
          name?: string
          post_count?: number
          slug?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          brand_id: string
          created_at: string
          garment_type: string
          id: string
          is_accurate: boolean
          measurement_type: string
          measurement_unit: string
          measurement_value: number
          size_eu: string | null
          size_uk: string | null
          size_us: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string
          garment_type: string
          id?: string
          is_accurate: boolean
          measurement_type: string
          measurement_unit: string
          measurement_value: number
          size_eu?: string | null
          size_uk?: string | null
          size_us?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string
          garment_type?: string
          id?: string
          is_accurate?: boolean
          measurement_type?: string
          measurement_unit?: string
          measurement_value?: number
          size_eu?: string | null
          size_uk?: string | null
          size_us?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      garments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      size_ranges: {
        Row: {
          brand_id: string
          confidence_score: number | null
          created_at: string
          garment_id: string
          id: string
          max_value: number
          measurement_type: string
          min_value: number
          region: string
          size_label: string
          unit: string
        }
        Insert: {
          brand_id: string
          confidence_score?: number | null
          created_at?: string
          garment_id: string
          id?: string
          max_value: number
          measurement_type: string
          min_value: number
          region: string
          size_label: string
          unit?: string
        }
        Update: {
          brand_id?: string
          confidence_score?: number | null
          created_at?: string
          garment_id?: string
          id?: string
          max_value?: number
          measurement_type?: string
          min_value?: number
          region?: string
          size_label?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "size_ranges_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "size_ranges_garment_id_fkey"
            columns: ["garment_id"]
            isOneToOne: false
            referencedRelation: "garments"
            referencedColumns: ["id"]
          },
        ]
      }
      standard_size_mappings: {
        Row: {
          alpha_size: string
          id: string
          max_value: number
          measurement_type: string
          min_value: number
          numeric_size: string
          region: string
        }
        Insert: {
          alpha_size: string
          id?: string
          max_value: number
          measurement_type: string
          min_value: number
          numeric_size: string
          region: string
        }
        Update: {
          alpha_size?: string
          id?: string
          max_value?: number
          measurement_type?: string
          min_value?: number
          numeric_size?: string
          region?: string
        }
        Relationships: []
      }
      user_measurements: {
        Row: {
          created_at: string
          id: string
          measurement_type: string
          unit: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          measurement_type: string
          unit: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          measurement_type?: string
          unit?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_measurements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string | null
          favorite_brands: string[] | null
          full_name: string | null
          id: string
          measurement_preferences: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          favorite_brands?: string[] | null
          full_name?: string | null
          id: string
          measurement_preferences?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          favorite_brands?: string[] | null
          full_name?: string | null
          id?: string
          measurement_preferences?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_size_history: {
        Row: {
          brand_id: string
          converted_size: Json
          created_at: string
          garment_id: string
          id: string
          measurement_type: string
          measurement_unit: string
          measurement_value: number
          user_id: string
        }
        Insert: {
          brand_id: string
          converted_size: Json
          created_at?: string
          garment_id: string
          id?: string
          measurement_type: string
          measurement_unit: string
          measurement_value: number
          user_id: string
        }
        Update: {
          brand_id?: string
          converted_size?: Json
          created_at?: string
          garment_id?: string
          id?: string
          measurement_type?: string
          measurement_unit?: string
          measurement_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_size_history_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_size_history_garment_id_fkey"
            columns: ["garment_id"]
            isOneToOne: false
            referencedRelation: "garments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_size_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      import_size_data: {
        Args: {
          p_brand_name: string
          p_garment_name: string
          p_region: string
          p_size_label: string
          p_measurement_type: string
          p_min_value: number
          p_max_value: number
          p_unit?: string
        }
        Returns: string
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
  public: {
    Enums: {},
  },
} as const
