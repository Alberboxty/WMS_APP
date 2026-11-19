import { http } from '@/services/http'
import type { RecoveryPassPayload } from '@/types/recoveryPass.types'

const BASE = '/recoveryPass/recoveryPass'

export const recoveryPassAPI = async (token: string, payload: RecoveryPassPayload) => {
  const { data } = await http.post(`${BASE}/${token}`, payload)
  return data
}