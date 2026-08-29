export type RaceStatus = "upcoming" | "quali_done" | "finished";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          pseudo: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          pseudo: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
        Relationships: [];
      };
      groups: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          invite_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          invite_code: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["groups"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "groups_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["group_members"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "group_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      races: {
        Row: {
          id: string;
          name: string;
          circuit: string;
          country: string;
          race_date: string;
          quali_date: string;
          status: RaceStatus;
          external_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          circuit: string;
          country: string;
          race_date: string;
          quali_date: string;
          status?: RaceStatus;
          external_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["races"]["Insert"]>;
        Relationships: [];
      };
      predictions: {
        Row: {
          id: string;
          user_id: string;
          race_id: string;
          podium_1: string;
          podium_2: string;
          podium_3: string;
          safety_car: boolean;
          first_dnf: string | null;
          fastest_lap: string | null;
          submitted_at: string;
          locked: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          race_id: string;
          podium_1: string;
          podium_2: string;
          podium_3: string;
          safety_car: boolean;
          first_dnf?: string | null;
          fastest_lap?: string | null;
          submitted_at?: string;
          locked?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["predictions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "predictions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "predictions_race_id_fkey";
            columns: ["race_id"];
            isOneToOne: false;
            referencedRelation: "races";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "predictions_podium_1_fkey";
            columns: ["podium_1"];
            isOneToOne: false;
            referencedRelation: "drivers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "predictions_podium_2_fkey";
            columns: ["podium_2"];
            isOneToOne: false;
            referencedRelation: "drivers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "predictions_podium_3_fkey";
            columns: ["podium_3"];
            isOneToOne: false;
            referencedRelation: "drivers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "predictions_first_dnf_fkey";
            columns: ["first_dnf"];
            isOneToOne: false;
            referencedRelation: "drivers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "predictions_fastest_lap_fkey";
            columns: ["fastest_lap"];
            isOneToOne: false;
            referencedRelation: "drivers";
            referencedColumns: ["id"];
          },
        ];
      };
      race_results: {
        Row: {
          id: string;
          race_id: string;
          podium_1: string;
          podium_2: string;
          podium_3: string;
          safety_car: boolean;
          first_dnf: string | null;
          fastest_lap: string | null;
        };
        Insert: {
          id?: string;
          race_id: string;
          podium_1: string;
          podium_2: string;
          podium_3: string;
          safety_car: boolean;
          first_dnf?: string | null;
          fastest_lap?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["race_results"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "race_results_race_id_fkey";
            columns: ["race_id"];
            isOneToOne: true;
            referencedRelation: "races";
            referencedColumns: ["id"];
          },
        ];
      };
      drivers: {
        Row: {
          id: string;
          name: string;
          team: string;
          number: number;
          active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          team: string;
          number: number;
          active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["drivers"]["Insert"]>;
        Relationships: [];
      };
      scores: {
        Row: {
          id: string;
          user_id: string;
          race_id: string;
          group_id: string;
          points: number;
          calculated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          race_id: string;
          group_id: string;
          points: number;
          calculated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["scores"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "scores_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scores_race_id_fkey";
            columns: ["race_id"];
            isOneToOne: false;
            referencedRelation: "races";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scores_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_group: {
        Args: { group_name: string };
        Returns: Database["public"]["Tables"]["groups"]["Row"];
      };
      join_group_by_code: {
        Args: { code: string };
        Returns: Database["public"]["Tables"]["groups"]["Row"];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
