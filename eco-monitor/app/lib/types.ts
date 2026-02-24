export interface Equipment {
  id: string;
  model: string;
  brand: string;
  location: string;
  city: string;
  state: string;
  installationDate: string;
  gasType: "R-134a" | "R-404A" | "R-290" | "R-600a";
  gasCharge: number; // kg
  lastServiceDate: string;
  technician: string;
  coordinates: { lat: number; lng: number };
  status: "active" | "warning" | "critical";
  age: number; // years
  integrityPercent: number; // 0-100
  remainingLifePercent: number; // 0-100
}

export interface RecoveryEvent {
  id: string;
  technicianName: string;
  certificationNumber: string;
  equipmentId: string;
  gasRecoveredKg: number;
  destinationCenter: string;
  date: string;
  semarnatManifest: string;
  retcNumber: string;
  gasCondition: "reusable" | "treatment" | "destroy";
}

export interface MonthlyRecovery {
  month: string;
  kg: number;
}

export interface ESGMetrics {
  totalEquipment: number;
  totalHFCInField: number; // kg
  co2eAvoided: number; // tons
  carbonCreditsGenerated: number;
  creditValueUSD: number;
  monthlyRecovery: MonthlyRecovery[];
  hfcRecoveredTotal: number; // kg
}

export interface FleetBreakdown {
  gasType: string;
  percentage: number;
  equipmentCount: number;
}

export interface RegionalCompliance {
  region: string;
  equipmentCount: number;
  gasInField: number; // kg
  equipmentRetired: number;
  gasRecovered: number; // kg
  creditsGenerated: number;
  status: "active" | "warning" | "critical";
  nomCompliance: "Cumple" | "En proceso" | "Incumple";
}

export interface TemperatureData {
  month: string;
  temp: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: "warning" | "critical" | "info";
  description: string;
}

export interface AuthorizedCenter {
  id: string;
  name: string;
  city: string;
  state: string;
}
