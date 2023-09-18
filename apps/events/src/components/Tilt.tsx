

import React, { ReactNode, useEffect, useRef } from 'react'
import VanillaTilt, { TiltOptions } from 'vanilla-tilt'

function Tilt(props: {options?: TiltOptions, children: ReactNode, [x: string]: unknown}) {
  const {children, options = {}} = props
  const root = useRef<HTMLElement | HTMLElement[]>(null)
  useEffect(() => {
    if (!root.current) return
    VanillaTilt.init(root.current, {
      max: 7.5,
      scale: 1.05,
      speed: 700,
      glare: true,
      "max-glare": 0.35,
      gyroscope: false,
      ...options
    })
  }, [])
  return React.cloneElement(children as any, { ref: root })
}

export default Tilt