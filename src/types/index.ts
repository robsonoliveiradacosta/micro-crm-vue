// === Auth ===

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  token: string
  type: string
}

// === Client ===

export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  createdAt: string
}

export interface ClientRequest {
  name: string
  email?: string
  phone?: string
  company?: string
}

// === Project ===

export type ProjectStatus = 'ORCAMENTO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO'

export interface Project {
  id: string
  clientId: string
  title: string
  description?: string
  value: number
  status: ProjectStatus
  startDate?: string
  endDate?: string
  createdAt: string
}

export interface ProjectRequest {
  clientId: string
  title: string
  description?: string
  value: number
  startDate?: string
  endDate?: string
}

export interface ProjectStatusUpdateRequest {
  status: ProjectStatus
}

// === Note ===

export interface Note {
  id: string
  projectId: string
  content: string
  createdAt: string
}

export interface NoteRequest {
  content: string
}

// === Dashboard ===

export interface Dashboard {
  totalClients: number
  totalByStatus: Record<ProjectStatus, number>
}

// === API Errors ===

export interface ApiError {
  status: number
  error: string
  message: string
  timestamp: string
}

export interface FieldError {
  field: string
  message: string
}

export interface ApiValidationError extends ApiError {
  fieldErrors: FieldError[]
}
