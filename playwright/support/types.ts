export type OrderStatus = 'confirmed' | 'cancelled'

export type DaysCount = 1 | 2 | 3

export interface Rover {
  id: string
  code: string
  model: string
  seats: number
  rangeKm: number
  maxSpeedKmh: number
  pressurized: boolean
  dailyRate: number
  description: string
  features: string[]
  imageUrl?: string | null
}

export interface CustomerData {
  fullName: string
  email: string
  passport: string
  birthDate: string // DD/MM/AAAA
}

export interface Order {
  id: string
  reservationCode: string
  roverId: string
  customerName: string
  customerEmail: string
  customerPassport: string
  customerBirthDate: string // YYYY-MM-DD
  daysCount: DaysCount
  dailyRate: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
}

export interface SeedOrderInput {
  reservationCode?: string
  roverCode: string
  customerName: string
  customerEmail: string
  customerPassport: string
  customerBirthDate: string // YYYY-MM-DD
  daysCount: DaysCount
  status?: OrderStatus
}
