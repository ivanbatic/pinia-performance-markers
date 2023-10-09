import type { PiniaPlugin } from 'pinia'
import type { PerformanceMarkersPluginConfig } from './types'

export function createPerformanceMarkersPiniaPlugin(config: PerformanceMarkersPluginConfig = {}) {
  const plugin: PiniaPlugin = ({ store, options }) => {
    const storeName = store.$id
    const getters = options.getters

    for (const getterName in getters) {
      const original = getters[getterName]
      const markName = `[Getter] ${storeName} › ${getterName}`

      getters[getterName] = function (this: any, ...args: any[]) {
        performance.mark(markName + '-start')
        const result = (original as any).apply(this, args)
        performance.mark(markName + '-end')
        const metrics = performance.measure(markName, markName + '-start', markName + '-end')
        config.onGetter?.({ name: getterName, duration: metrics.duration })

        return result
      }
    }

    store.$onAction(({ name, after }) => {
      const markName = `[Action] ${storeName} › ${name}`
      performance.mark(markName + '-start')

      after(() => {
        performance.mark(markName + '-end')
        const metrics = performance.measure(markName, markName + '-start', markName + '-end')
        config.onAction?.({ name, duration: metrics.duration })
      })
    })
  }
  return plugin
}
