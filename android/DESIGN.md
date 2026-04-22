---
name: Complaint Register Portal
colors:
  light:
    primary: "#005394"
    on-primary: "#FFFFFF"
    primary-container: "#2B6CB0"
    on-primary-container: "#E1ECFF"
    secondary: "#006D40"
    on-secondary: "#FFFFFF"
    secondary-container: "#8EF5B5"
    on-secondary-container: "#007243"
    tertiary: "#784600"
    on-tertiary: "#FFFFFF"
    tertiary-container: "#9A5B00"
    on-tertiary-container: "#FFE7D2"
    error: "#BA1A1A"
    on-error: "#FFFFFF"
    error-container: "#FFDAD6"
    on-error-container: "#93000A"
    background: "#F7FAFC"
    on-background: "#181C1E"
    surface: "#F7FAFC"
    on-surface: "#181C1E"
    surface-variant: "#E0E3E5"
    on-surface-variant: "#414750"
    outline: "#727782"
    outline-variant: "#C1C7D2"
  dark:
    primary: "#9ECAFF"
    on-primary: "#00325B"
    primary-container: "#004A84"
    on-primary-container: "#D1E4FF"
    secondary: "#73D8A0"
    on-secondary: "#00391F"
    secondary-container: "#00522F"
    on-secondary-container: "#8EF5B5"
    tertiary: "#FFB86F"
    on-tertiary: "#4A2800"
    tertiary-container: "#693C00"
    on-tertiary-container: "#FFDCBE"
    error: "#FFB4AB"
    on-error: "#690005"
    error-container: "#93000A"
    on-error-container: "#FFDAD6"
    background: "#181C1E"
    on-background: "#E2E2E6"
    surface: "#181C1E"
    on-surface: "#E2E2E6"
    surface-variant: "#414750"
    on-surface-variant: "#C1C7D2"
    outline: "#8B919A"
    outline-variant: "#414750"
typography:
  body-large:
    fontFamily: "System Default"
    fontWeight: "400"
    fontSize: "16sp"
    lineHeight: "24sp"
    letterSpacing: "0.5sp"
rounded:
  sm: "4dp"
  md: "8dp"
  lg: "16dp"
  xl: "24dp"
  full: "9999dp"
spacing:
  base: "8dp"
  sm: "4dp"
  md: "16dp"
  lg: "24dp"
  xl: "32dp"
---

## Brand & Style

The Complaint Register Portal employs a modern, serious, and trustworthy design aesthetic suitable for civic, institutional, or corporate grievance management. The color palette focuses on dependable blues (primary), reassuring greens (secondary), and alerting warm tones (tertiary and error), ensuring that the system feels authoritative yet highly accessible. 

Built solidly on Material Design 3 (M3) principles, the interface leverages Jetpack Compose to deliver a dynamic, natively responsive, and polished user experience.

## Colors

The application relies on a robust semantic token system mapped entirely to Material Design 3 roles. This setup ensures seamless transitions between Light and Dark modes.

- **Primary Colors:** Dependable blues drive the main actions and core branding elements, providing strong emphasis and a professional tone.
- **Secondary Colors:** Reassuring greens are reserved for complementary components, conveying a sense of progression, status, or successful resolutions.
- **Tertiary Colors:** Warm accents introduce balance against the cool primary and secondary palettes, useful for highlighting specific data points or secondary interactions.
- **Error Colors:** Strict reds are utilized solely to signal destructive actions, validation failures, or critical alerts.

**Dynamic Theming:** The application natively supports `dynamicColor` on Android 12+ devices, gracefully adapting the UI to the user's wallpaper while maintaining strict accessibility and contrast standards.

## Typography

Typography relies entirely on the Android platform's default sans-serif font (Roboto). This zero-friction approach guarantees native legibility, optimal performance, and broad localization support across all devices.

The typographic scale prioritizes readability for potentially dense information architectures—such as long complaint descriptions or real-time chat messages. The core `{typography.body-large}` token acts as the standard workhorse for general paragraph and structural text.

## Layout & Spacing

The system is structured around a standard 8dp baseline grid for spatial rhythm and component layout. 

- **Density & Touch Targets:** By strictly adhering to multiples of the `{spacing.base}` token, the application naturally aligns with accessible touch-target requirements (minimum 48dp) and maintains a consistent visual cadence throughout complex forms and dashboards.

## Elevation & Depth

In alignment with modern M3 guidelines, verticality and depth are conveyed primarily through tonal elevation rather than aggressive drop shadows. 

Surfaces employ subtle color tinting based on the primary color to indicate hierarchy and overlapping contexts (e.g., modals or floating action buttons). This creates a clean, "flat but layered" aesthetic that feels lightweight and modern.

## Shapes

The "shape language" of the portal is organic but structured. Corners utilize standardized rounding tokens based on component scale and emphasis:

- **Structural Elements:** Large surfaces like bottom sheets, detail cards, or dialogs generally employ `{rounded.lg}` or `{rounded.xl}` to create soft, approachable containers.
- **Interactive Elements:** Smaller, higher-interaction elements like buttons, chips, and text field outlines lean toward `{rounded.full}` (stadium shapes) or `{rounded.md}` to clearly signify interactivity.
