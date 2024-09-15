import { scale } from 'svelte/transition'

export const scale_fast =
  (node: Element) =>
    scale(node, { start: 0.95, duration: 150 })
