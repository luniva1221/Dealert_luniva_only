import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Alert {
  id: string
  productId: string
  targetPrice: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  productName: string
  productImage: string
  currentPrice: number
  isTriggered: boolean
  lastCheckedAt: string
}

export function useAlerts() {
  const queryClient = useQueryClient()

  // Query user alerts
  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const res = await fetch('/api/alerts')
      if (!res.ok) {
        if (res.status === 401) return []
        throw new Error('Failed to fetch alerts')
      }
      const data = await res.json()

      // Map backend structure to client UI schema properties
      return data.map((alert: any) => {
        const currentPrice = alert.product?.currentPrice || 0
        return {
          id: alert.id,
          productId: alert.productId,
          targetPrice: alert.targetPrice,
          isActive: alert.isActive,
          createdAt: alert.createdAt,
          updatedAt: alert.updatedAt,
          productName: alert.product?.name || 'Unknown Product',
          productImage: alert.product?.imageUrl || '',
          currentPrice,
          isTriggered: currentPrice > 0 && currentPrice <= alert.targetPrice,
          lastCheckedAt: alert.updatedAt,
        }
      })
    },
  })

  // Create alert mutation
  const createMutation = useMutation({
    mutationFn: async (payload: { productId: string; targetPrice: number }) => {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create alert')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })

  // Edit alert target price mutation
  const editMutation = useMutation({
    mutationFn: async (payload: { id: string; targetPrice: number }) => {
      const res = await fetch(`/api/alerts/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPrice: payload.targetPrice }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to edit alert')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })

  // Delete alert mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/alerts/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to delete alert')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })

  // Toggle active/inactive status mutation
  const toggleMutation = useMutation({
    mutationFn: async (payload: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/alerts/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: payload.isActive }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to toggle alert')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })

  const createAlert = async (
    productId: string,
    targetPrice: number,
    currentPrice?: number,
    productName?: string,
    productImage?: string
  ) => {
    await createMutation.mutateAsync({ productId, targetPrice })
  }

  const editAlert = async (id: string, targetPrice: number) => {
    await editMutation.mutateAsync({ id, targetPrice })
  }

  const deleteAlert = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  const toggleAlert = async (id: string) => {
    const alert = alerts.find(a => a.id === id)
    if (!alert) return
    await toggleMutation.mutateAsync({ id, isActive: !alert.isActive })
  }

  return {
    alerts,
    isLoading,
    createAlert,
    editAlert,
    deleteAlert,
    toggleAlert,
    loading: createMutation.isPending || editMutation.isPending || deleteMutation.isPending || toggleMutation.isPending,
  }
}
