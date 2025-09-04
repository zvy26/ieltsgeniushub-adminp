import * as React from "react"

export const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />
})
RadioGroup.displayName = "RadioGroup"

export const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>((props, ref) => {
  return <input type="radio" ref={ref} {...props} />
})
RadioGroupItem.displayName = "RadioGroupItem"
