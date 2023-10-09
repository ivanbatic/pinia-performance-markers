export type OnMarkParams = {
  name: string
  duration: number
}

export interface PerformanceMarkersPluginConfig {
  onAction?: (data: OnMarkParams) => void
  onGetter?: (data: OnMarkParams) => void
}
