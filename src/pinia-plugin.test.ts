import { createPinia, defineStore, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { createPerformanceMarkersPiniaPlugin } from './pinia-plugin'
import type { OnMarkParams, PerformanceMarkersPluginConfig } from './types'

describe('Pinia plugin', () => {
  describe('actions', () => {
    it('logs slow actions', async () => {
      const onAction = vi.fn()
      const duration = 50
      setupStore({ onAction })

      const useTestStore = defineStore('actionTest', {
        actions: { slowAction: () => wait(duration) },
      })

      const store = useTestStore()
      await store.slowAction()

      expect(onAction).toHaveBeenCalledOnce()
      const call = onAction.mock.lastCall[0] as OnMarkParams
      expect(call.name).toBe('slowAction')
      expect(isRoughly(call.duration, duration))
    })
  })

  it('logs slow getters', () => {
    const onGetter = vi.fn()
    const duration = 50
    setupStore({ onGetter })

    const useTestStore = defineStore('test', {
      getters: { slowValue: () => syncBlock(duration) && 'slow' },
    })

    const store = useTestStore()
    store.slowValue

    expect(onGetter).toHaveBeenCalledOnce()
    const call = onGetter.mock.lastCall[0] as OnMarkParams
    expect(call.name).toBe('slowValue')
    expect(isRoughly(call.duration, duration))
  })
})

function syncBlock(ms: number): true {
  const startTime = Date.now()
  while (Date.now() < startTime + ms) {
    /* empty */
  }
  return true
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function setupStore(pluginConfig: PerformanceMarkersPluginConfig) {
  const app = createApp({})
  const pinia = createPinia()

  app.use(pinia)
  setActivePinia(pinia)
  const plugin = createPerformanceMarkersPiniaPlugin(pluginConfig)
  pinia.use(plugin)
}

function isRoughly(value: number, target: number, leeway = 2) {
  return value >= target - leeway && value <= target + leeway
}
