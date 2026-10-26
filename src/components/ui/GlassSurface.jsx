import { LiquidGlass } from 'quick-liquid/react'

// Shared liquid-glass surface powered by quick-liquid.
// Replaces the old flat `bg-white/8 backdrop-blur-md border border-white/10`
// frost with real refractive glass, tuned for this app's dark-only UI.
// Layout classes belong on a single inner element: LiquidGlass wraps
// children in its own content layer, so flex/grid classes placed on the
// surface itself would not reach them.
export default function GlassSurface({
  children,
  className = '',
  radius = 16,
  material = 'regular',
  tintOpacity,
  as,
  liquidPress = false,
  ...props
}) {
  const config = {
    material,
    appearance: 'dark',
    borderRadius: radius,
  }
  if (tintOpacity !== undefined) config.tintOpacity = tintOpacity

  return (
    <LiquidGlass
      as={as}
      config={config}
      liquidPress={liquidPress}
      className={className}
      {...props}
    >
      {children}
    </LiquidGlass>
  )
}
