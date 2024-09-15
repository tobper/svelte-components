export function classes(
  ...args: (string | Record<string, boolean> | null | undefined | false)[]
) {
  const classes = new Set<string>()

  for (const arg of args) {
    if (!arg)
      continue

    if (typeof arg === 'string')
      classes.add(arg)
    else
      for (const field in arg)
        if (arg[field])
          classes.add(field)
  }

  return Array.from(classes).join(' ')
}
