# MicroMarine Web – CSS architecture (V0.3 development)

## Current status
The original V0.27 remains on main. This branch extracts CSS and JavaScript without redesigning the interface. The legacy `styles.css` still contains most of the cascade; **the cleanup is not yet complete**.

## Loading order
1. `styles/tokens.css` — shared design tokens and defaults
2. `styles/layout.css` — global reset and layout primitives
3. `styles.css` — original compatibility cascade, retained to avoid regression
4. `styles/components.css` — latest control geometry
5. `styles/themes/{maritime,neutral,walnut}.css` — palette variables

## Rules for future themes
- New themes use `body[data-theme="name"]` and CSS custom properties.
- Never change dimensions or interactions to implement a new color theme.
- Theme-specific textures may use scoped selectors; shared geometry belongs in components/layout.
- Preserve selector specificity and @media context when migrating rules; moving rules can change cascade order.
- Avoid adding new `!important` declarations; resolve the source rule instead.

## Acceptance checklist before merging
- Verify all three themes in portrait and iPhone landscape (including safe-area corners).
- Verify sail, single motor, and twin motor profiles.
- Verify rotary knob and roller both cycle profiles; lights toggle/tilt; STOP resets local values.
- Verify throttle neutral detent, left/right steering, heading rotation and gauge readouts.
- Confirm zero console errors and no missing CSS/JS requests.
- Confirm unchanged appearance against V0.27 screenshots.
- Test disconnection/real failsafe separately before attaching motors: current STOP is UI-only.

## Refactor goal
Migrate the old cascade by rule ownership into layout, components and themes, then delete the compatibility stylesheet. Do not declare the refactor complete while the compatibility stylesheet remains dominant.
