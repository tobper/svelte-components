import { fly } from 'svelte/transition'

export const page_slide =
  (direction: 'left' | 'right') =>
    function (node: Element) {
      const duration = 200
      const opacity = 0
      const x = direction === 'left' ? '30%' : '-30%'

      return fly(node, { x, duration, opacity })
    }
