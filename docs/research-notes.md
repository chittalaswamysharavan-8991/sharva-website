# Pablo Cockpit Research Notes

## Research Sources

- Apple Safari Web Content Guide: iOS web apps can use home-screen icons, standalone mode, launch titles, and status-bar styling when added to Home Screen.
- MDN Web App Manifest: installable PWAs use a manifest for name, icons, start URL, display mode, theme color, and background color.
- Nielsen Norman Group dashboard guidance: dashboards should make important structure easy to perceive quickly instead of relying on decoration.
- Li, Dey, and Forlizzi personal informatics model: useful personal systems move through preparation, collection, integration, reflection, and action; friction in early stages cascades into later failure.

## Product Decisions Applied

- Capture is fast and forgiving because collection must not wait for perfect organization.
- Today screen emphasizes one next action because reflection should convert into action.
- Home uses three simple metrics before the atlas because dashboard cognition needs quick orientation.
- Private and public routes are separate because the product has different audiences and privacy rules.
- iPhone support uses manifest, icons, standalone metadata, safe-area layout, and a stable `/home` start route.

## Future Research Backlog

- Test whether the first screen should open to `/home` or `/today` after one week of real use.
- Add a daily review prompt that asks for one proof move, one body signal, and one close action.
- Add connector sync only after deciding which data should be automatic and which should stay manually captured.
- Measure whether the cockpit reduces context switching or becomes another dashboard to maintain.
