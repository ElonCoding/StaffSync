# Phase 4: Project Design Phase — UI/UX Design System & Token Architecture

## 1. Editorial Aesthetic Philosophy
StaffSync avoids generic, sterile enterprise dashboard templates in favor of a warm, humanistic editorial aesthetic. Drawing inspiration from modern high-craft publications and tactile stationery, the design balances clarity, spacious typography, and subtle micro-interactions.

---

## 2. Color Palette & Semantic Design Tokens

| Token Name | Hex Code | HSL / RGB | Usage & Semantic Meaning |
| :--- | :--- | :--- | :--- |
| **Evergreen (Primary)** | `#173D32` | `hsl(164, 45%, 16%)` | Primary brand accent, primary CTA buttons, active sidebar pills |
| **Forest Deep (Heading)**| `#102820` | `hsl(163, 43%, 11%)` | Primary display titles, headers, brand logotype |
| **Warm Ivory (Canvas)** | `#EAE9DF` | `hsl(56, 20%, 90%)` | Main application background, warm page canvas |
| **Clean Ivory (Cards)** | `#F7F8F5` | `hsl(75, 14%, 97%)` | Surface cards, drawer background, input fill |
| **Subtle Border** | `#E6EBE5` | `hsl(110, 11%, 91%)` | Card outlines, table dividers, separator lines |
| **Muted Sage (Text)** | `#7E8980` | `hsl(133, 5%, 52%)` | Secondary body text, timestamps, helper copy |
| **Volt Lime (Accent)** | `#C7F36B` | `hsl(80, 84%, 69%)` | High-visibility action accents (plus icons, badges) |
| **Status: Success** | `#34785B` | `hsl(154, 40%, 34%)` | Approved leaves, Present attendance, Completed tracks |
| **Status: Warning** | `#B7791F` | `hsl(36, 71%, 42%)` | Pending approvals, In-progress modules, Late clock-ins |
| **Status: Danger** | `#C53030` | `hsl(0, 61%, 48%)` | Rejected leaves, Absent records, Validation alerts |

---

## 3. Typography Hierarchy
1. **Display & Headings**: `DM Serif Display` (Google Fonts)
   - Conveys editorial warmth, gravitas, and institutional trustworthiness.
   - Used for page titles (`h1`, `h2`), modal headers, and key numerical metrics.
2. **Body & User Interface**: `Inter` (Google Fonts)
   - Highly legible at small sizes (10px–13px) across high-density table registers and forms.
   - Neutral geometry prevents optical fatigue during extended daily use.
3. **Data & Telemetry**: Monospace (`ui-monospace`, `SFMono-Regular`)
   - Employed for shift timestamps, employee ID tags (`STF-8733`), and percentage metrics.

---

## 4. Interactive Components & Micro-Interactions
- **Three.js Synchronized Canvas**: Interactive geometric visualization on the landing hero that dynamically responds to cursor trajectory.
- **Unified Dashboard Layout**: Collapsible sidebar navigation, live user avatar badge, and integrated 1-click attendance clock-in widget.
- **Glassmorphism Modals**: Centered backdrop-blur overlay (`backdrop-blur-xs`) ensuring focused attention during data entry.
