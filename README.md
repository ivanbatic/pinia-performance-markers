# `pinia-performance-markers`

`pinia-performance-markers` is records performance metrics of Pinia getters and actions and adds performance markers to the browser's performance profile.  

This is an ESM module.
## Installation

```shell
npm install pinia-performance-markers
```

## Usage

```typescript
import { createPinia } from 'pinia'
import { createPerformanceMarkersPiniaPlugin } from 'pinia-performance-markers'

const pinia = createPinia()
// Plugin creation must be called before stores get created
pinia.use(createPerformanceMarkersPiniaPlugin())
```
