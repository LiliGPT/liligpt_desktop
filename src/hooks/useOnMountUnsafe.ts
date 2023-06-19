// https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
import type { EffectCallback } from "react"
import { useEffect, useRef } from "react"

export function useOnMountUnsafe(effect: EffectCallback) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      effect()
    }
  }, [])
}
