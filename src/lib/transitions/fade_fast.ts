import { fade } from 'svelte/transition'

export const fade_fast =
  (node: Element) =>
    fade(node, { duration: 150 })
