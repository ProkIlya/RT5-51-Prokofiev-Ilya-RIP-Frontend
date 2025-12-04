export interface DrivingScenario {
  id: number;
  name: string;
  description: string;
  status: string;
  image_url: string;
  type: string;
  system_consumption: number;
  speed: number;
  aero_coeff: number;
  rolling_coeff: number;
}
/*
export interface TripApplication {
  ID: number;
  Status: string;
  CreatorID: number;
  StartCharge?: number;
  RemainingCharge?: number;
  CreatedAt: string;
  SubmittedAt?: string;
  CompletedAt?: string;
  ModeratorID?: number;
  Creator: User;
  Moderator?: User;
}

export interface User {
  ID: number;
  Login: string;
  Password: string;
  IsModerator: boolean;
}

export interface TripScenario {
  TripApplicationID: number;
  DrivingScenarioID: number;
  Duration?: number;
  TripApplication: TripApplication;
  DrivingScenario: DrivingScenario;
}
*/
export interface CartResponse {
  trip_id: number;
  count: number;
}
  