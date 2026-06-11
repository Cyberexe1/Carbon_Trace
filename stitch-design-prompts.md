# Google Stitch Design Prompts
## Carbon Footprint Awareness Platform — All Pages

> **How to use:** Copy each prompt block into Google Stitch's prompt input.
> Each prompt is self-contained and includes layout, colors, components, and interactions.
> Run them in order — the design system prompt first, then pages individually.

---

## PROMPT 0 — Design System & Brand Tokens
> Run this FIRST. All subsequent prompts reference this system.

```
Create a design system for a Carbon Footprint Awareness web app called "CarbonTrace".

BRAND IDENTITY:
- Name: CarbonTrace
- Tagline: "See your impact. Change your world."
- Personality: Trustworthy, motivating, clean, science-backed — not preachy or guilt-driven

COLOR PALETTE:
Primary Green: #16a34a (buttons, active states, positive indicators)
Light Green Background: #f0fdf4 (page backgrounds, success states)
Dark Green Text: #14532d (headings, high emphasis text)
Amber Warning: #d97706 (moderate carbon scores)
Red Alert: #dc2626 (high carbon scores)
Neutral Gray 900: #111827 (body text)
Neutral Gray 500: #6b7280 (secondary text, labels)
Neutral Gray 100: #f3f4f6 (card backgrounds, dividers)
White: #ffffff (card surfaces, modal backgrounds)
Deep Charcoal: #1c1917 (dark mode background)

TYPOGRAPHY:
- Font Family: Inter (sans-serif)
- Hero Heading: 56px / 700 weight / -0.02em letter spacing
- Page Heading H1: 36px / 700 weight
- Section Heading H2: 24px / 600 weight
- Card Title H3: 18px / 600 weight
- Body Large: 16px / 400 weight / 1.6 line height
- Body Small: 14px / 400 weight
- Label/Caption: 12px / 500 weight / uppercase / 0.05em letter spacing
- Mono (carbon numbers): JetBrains Mono, 16px

SPACING SYSTEM: 4px base unit — 4, 8, 12, 16, 24, 32, 48, 64, 96px

BORDER RADIUS:
- Cards: 16px
- Buttons: 10px
- Badges/Tags: 999px (pill)
- Input fields: 8px
- Modal: 20px

ELEVATION / SHADOWS:
- Card subtle: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
- Card hover: 0 8px 24px rgba(0,0,0,0.10)
- Modal: 0 20px 60px rgba(0,0,0,0.18)

ICON STYLE: Lucide icons, 20px default, 24px for navigation, stroke-width 1.75

BUTTON VARIANTS:
- Primary: bg #16a34a, text white, hover #15803d, 44px height
- Secondary: bg white, border 1.5px #16a34a, text #16a34a, hover bg #f0fdf4
- Destructive: bg #dc2626, text white
- Ghost: no background, text #6b7280, hover bg #f3f4f6
- All buttons: 10px radius, 16px horizontal padding, Inter 600 weight

CARBON SCORE COLORS (used in meters and badges):
- Low (0–5 kg today): Green #16a34a — label "Great"
- Moderate (5–15 kg): Amber #d97706 — label "Moderate"
- High (15+ kg): Red #dc2626 — label "High"
- Each status uses BOTH color AND an icon (never color alone)

NAVIGATION: Top navbar on desktop + bottom tab bar on mobile (375px)

DARK MODE: Full dark mode support. Background #1c1917, cards #292524, text #fafaf9
```

---

## PROMPT 1 — Landing Page (Marketing / Home)

```
Design a full landing page for "CarbonTrace" — a Carbon Footprint Awareness web app.
Use the CarbonTrace design system (Inter font, primary green #16a34a, bg #f0fdf4).
Desktop width 1440px. Include a mobile view at 375px.

PAGE SECTIONS (in order, top to bottom):

--- SECTION 1: NAVIGATION BAR ---
- Fixed top navbar, white background, subtle bottom border
- Left: CarbonTrace logo — leaf icon (green) + wordmark in dark charcoal, 600 weight
- Center: Nav links — "How It Works", "Features", "Community", "Learn"
- Right: "Sign In" ghost button + "Get Started Free" primary green button
- Mobile: hamburger menu icon replacing center links, logo left, CTA button right

--- SECTION 2: HERO ---
- Full-width, light green bg (#f0fdf4), min-height 90vh
- Left column (60%):
  - Eyebrow label: "🌍 Join 50,000+ climate-aware individuals" — small green pill badge
  - H1 headline: "See your carbon footprint. Shrink it one habit at a time."
  - Subheadline (18px, gray 600): "CarbonTrace turns invisible CO₂ emissions into a daily score. Log your activities, get AI-powered tips, and track real progress — in under 2 minutes a day."
  - Two CTA buttons side by side: "Start Tracking Free" (primary green) + "Watch Demo" (secondary with play icon)
  - Below buttons: 3 trust signals in a row — shield icon "No credit card", checkmark "Free forever plan", star "4.9/5 from 2,400 reviews"
- Right column (40%):
  - Floating app mockup — phone frame showing the dashboard screen
  - Behind mockup: abstract wavy green gradient blob shape
  - Two floating stat cards overlapping the mockup:
    - Card 1 (top left): "↓ 23%" + "Carbon reduced this month" in white card
    - Card 2 (bottom right): "🔥 14 day streak" in white card

--- SECTION 3: SOCIAL PROOF BAR ---
- Gray 50 background, horizontal strip
- Text: "Trusted by sustainability teams at"
- 5 company logo placeholders in a row (greyscale): [Company 1] [Company 2] [Company 3] [Company 4] [Company 5]

--- SECTION 4: HOW IT WORKS ---
- White background
- Centered section heading: "Track, Understand, Reduce" with green underline accent
- Subheading: "Three simple steps to meaningful climate action"
- 3 steps in a horizontal row, each with:
  - Large step number (01, 02, 03) in light green, 72px, semi-transparent
  - Icon in a green circle (32px icons): Step 1 = clipboard-list, Step 2 = bar-chart, Step 3 = leaf
  - Step title: "Log Your Activities", "See Your Impact", "Take Action"
  - Description: 2 sentences each explaining the step
  - Connecting arrow between steps (desktop only)
- Below the 3 steps: a full-width app screenshot mockup showing the activity logging interface

--- SECTION 5: FEATURES GRID ---
- Light green bg (#f0fdf4)
- Section heading: "Everything you need to go green"
- 6 feature cards in a 3x2 grid (2x3 on mobile):
  1. Icon: activity — "Activity Logging" — "Log transport, diet, energy, shopping in under 2 min"
  2. Icon: brain-circuit — "AI Recommendations" — "Gemini AI analyzes your habits and ranks impactful actions"
  3. Icon: trending-down — "Real-Time Score" — "Watch your carbon score update instantly after each log"
  4. Icon: target — "Goal Tracking" — "Set reduction goals with deadlines and auto-tracked progress"
  5. Icon: users — "Community Challenges" — "Join monthly challenges and compete with friends"
  6. Icon: book-open — "Education Hub" — "Learn the why behind every emission category"
- Each card: white bg, 16px radius, green icon in top-left, hover lifts with shadow

--- SECTION 6: CARBON SCORE VISUALIZATION ---
- White background, 2-column layout
- Left: Large animated donut chart mockup showing breakdown:
  - Transport 38% (blue-green)
  - Diet 29% (amber)
  - Energy 18% (purple)
  - Shopping 15% (rose)
  Center of donut: "156 kg" in mono font + "this month" label
- Right: text content
  - Heading: "Your footprint, broken down by what actually matters"
  - Body text explaining the 5 categories
  - Comparison stat: "Average person emits 400 kg/month. You're 61% below average." with a progress bar
  - CTA: "See your breakdown →" link in green

--- SECTION 7: TESTIMONIALS ---
- Gray 50 background
- Section heading: "Real people, real reductions"
- 3 testimonial cards in a row:
  - Each card: white bg, quote text (italic), author name + avatar initial circle + "Reduced by X% in 3 months" green badge
  - Card 1: "I had no idea my daily commute was my biggest footprint. CarbonTrace made it obvious and gave me a simple swap that saved 80kg/month." — Marcus T., Software Engineer
  - Card 2: "The AI recommendations actually fit my life. Not generic 'eat less meat' advice — specific, ranked suggestions I could act on." — Priya S., Student
  - Card 3: "We ran a company challenge with 40 employees. Watching the team leaderboard made sustainability competitive and fun." — Aisha R., Sustainability Lead

--- SECTION 8: PRICING / CTA BANNER ---
- Deep green background (#14532d), white text
- Left: "Start for free. No credit card required."
- Subtext: "Full access to tracking, AI recommendations, and community features — free forever."
- Right: Large "Get Started Free" button (white bg, green text)
- Small text below: "Pro plan available for teams and organizations — from $8/month"

--- SECTION 9: FOOTER ---
- Dark charcoal background (#1c1917), white/gray text
- Top row: Logo + tagline | Links in 4 columns: Product, Community, Resources, Company
- Bottom row: © 2026 CarbonTrace | Privacy Policy | Terms | Cookie Settings
- Social icons: Twitter/X, LinkedIn, Instagram, GitHub
```

---

## PROMPT 2 — Authentication Pages (Login & Register)

```
Design Login and Register pages for "CarbonTrace" carbon footprint app.
Use design system: Inter font, primary green #16a34a, clean minimal layout.
Desktop 1440px + mobile 375px views.

--- LOGIN PAGE ---
LAYOUT: Split-screen, 50/50
Left panel:
- Dark green gradient background (#14532d to #166534)
- Large white CarbonTrace logo centered
- Below logo: rotating quotes/stats — "23 million kg CO₂ tracked by our community"
- Decorative abstract leaf/wave pattern in lighter green overlay
- Bottom: "New to CarbonTrace? Join free →" link in white

Right panel (white background):
- Top: "Welcome back" — H2, dark charcoal
- Subtext: "Track your impact. Drive your change."
- Divider: "Continue with" section
  - "Continue with Google" button — white bg, Google color icon, gray border, full width
- OR divider with horizontal lines
- Email input field with envelope icon
- Password input field with lock icon + show/hide toggle eye icon
- Row: "Remember me" checkbox left + "Forgot password?" link right (green)
- "Sign In" primary green button, full width, 48px height
- Bottom: "Don't have an account? Sign up free" link

--- REGISTER PAGE ---
LAYOUT: Same split-screen as login
Left panel: Same as login but quote changes to "Join 50,000+ climate-aware individuals"

Right panel:
- "Create your account" H2
- Subtext: "Start understanding your carbon footprint today — free forever."
- Google sign-up button (same as login)
- OR divider
- First Name + Last Name fields side by side
- Email field
- Password field with strength indicator bar below (4 segments: red → amber → green → dark green)
- Country/Region dropdown with globe icon (affects emission factor calculations)
- Checkbox: "I agree to Terms of Service and Privacy Policy" with links
- "Create Free Account" primary green button, full width
- "Already have an account? Sign in" link

MOBILE: Stack everything vertically. Hide left panel. Show logo at top. Same form below.
```

---

## PROMPT 3 — Onboarding Flow (3 Steps)

```
Design a 3-step onboarding wizard for CarbonTrace after account creation.
Full-screen overlay flow, white background, progress indicator at top.
Desktop 1440px + mobile 375px.

GLOBAL ELEMENTS:
- Top progress bar: 3 dots/steps connected by line — active step is green filled circle
- Step label: "Step 1 of 3 — Tell us about yourself"
- Skip link top-right: "Skip for now" in gray
- Back/Next navigation at bottom of each step

--- STEP 1: LIFESTYLE QUIZ ---
Heading: "Where do you live?"
Subheading: "We use your location to calculate accurate emission factors for your energy grid and transport."
- Large country search dropdown with flag icons
- Below: Region/State dropdown (appears after country selected)
- Info tooltip icon: "Why do we need this? Different countries have different electricity carbon intensity."

Below location, heading: "What best describes your lifestyle?"
- 4 large selectable cards in 2x2 grid:
  - 🚗 "Car-dependent" — I drive for most trips
  - 🚌 "Public transit user" — Bus, metro, or train
  - 🚲 "Active traveler" — Walk, bike, or e-scooter
  - ✈️ "Frequent flyer" — I fly multiple times a year
- Each card: white bg, large emoji, bold label, description text, green checkmark when selected

--- STEP 2: BIGGEST CONCERN ---
Heading: "What's your biggest carbon concern?"
Subheading: "We'll prioritize your recommendations around what matters most to you."
- 5 large selectable option cards in a vertical list:
  - 🚗 Transport & travel
  - 🍔 Food & diet
  - ⚡ Home energy & utilities
  - 🛍️ Shopping & consumption
  - ♻️ Waste & recycling
- Multi-select allowed — checkboxes in top-right of each card
- Each card shows a small "avg impact" indicator: e.g., "Transport: ~40% of avg footprint"

--- STEP 3: YOUR FIRST GOAL ---
Heading: "Set your first goal"
Subheading: "Based on your lifestyle, here's what we recommend:"
- AI-generated suggested goal card (prominent, green border):
  - Icon: target
  - Goal: "Reduce transport emissions by 20% in 30 days"
  - Estimated saving: "≈ 45 kg CO₂e"
  - Difficulty: ⭐⭐ Moderate
  - "Accept this goal" primary button
- Below: "Or choose a different goal →" expandable section showing 3 alternative goals
- Below goals: "What's CO₂e?" expandable info accordion

FINAL STATE (after accepting goal):
- Celebration animation: green confetti burst
- Large checkmark circle
- Heading: "You're all set, [Name]! 🌱"
- Subheading: "Your baseline has been estimated. Now let's start tracking."
- "Go to my dashboard →" large green button
```

---

## PROMPT 4 — Main Dashboard

```
Design the main dashboard page for CarbonTrace carbon footprint app.
This is the primary view users see after login.
Desktop 1440px with left sidebar nav. Mobile 375px with bottom tab bar.
Use design system: green #16a34a, Inter font, white cards on #f8fafc background.

LAYOUT: Fixed left sidebar (240px) + main content area (scrollable)

--- LEFT SIDEBAR ---
Top: CarbonTrace logo
User avatar + name + "14-day streak 🔥" badge
Navigation items (icon + label, active = green bg pill):
- 🏠 Dashboard (active)
- 📋 Log Activity
- 📊 Insights
- 🎯 Goals
- 👥 Community
- 📚 Learn
- ⚙️ Settings
Bottom of sidebar: "Log Activity" prominent green button (full width)

--- MAIN CONTENT AREA ---

ROW 1 — TOP BAR:
- Left: "Good morning, Marcus 👋" greeting
- Right: Notification bell icon (with badge count) + user avatar

ROW 2 — CARBON SCORE HERO WIDGET (full width, prominent card):
- Background: gradient from #14532d to #166534, white text
- Left section:
  - Label: "TODAY'S CARBON SCORE" in small caps
  - Large number: "8.4 kg CO₂e" in JetBrains Mono, 48px, white
  - Status badge: amber "Moderate" pill with warning icon
  - Comparison: "↑ 2.1 kg from yesterday" in amber
- Center: Vertical progress meter/gauge (like a fuel gauge) — filled to moderate level
- Right section:
  - "This Week" mini stat: "42 kg"
  - "This Month" mini stat: "156 kg"  
  - "vs. National Avg" mini stat: "↓ 38%" in green
- Bottom strip: 7-day mini bar chart sparkline inside the card

ROW 3 — 4 STAT CARDS (equal width):
Card 1: Leaf icon green — "Transport" — "3.2 kg" — "↓ 12% vs last week" green
Card 2: Utensils icon amber — "Diet" — "2.8 kg" — "↑ 5% vs last week" red
Card 3: Zap icon purple — "Energy" — "1.6 kg" — "↓ 8% vs last week" green
Card 4: Flame icon orange — "Streak" — "14 days" — "Longest: 21 days"

ROW 4 — TWO COLUMN LAYOUT:

LEFT COLUMN (65%):
- Section heading: "Weekly Carbon Trend"
- Line chart (Recharts style): 7 days on X axis, kg CO₂e on Y axis
  - Single green line with area fill below (light green gradient)
  - Today's point highlighted with a dot and tooltip: "Today: 8.4 kg"
  - Dashed horizontal line: "Your Goal: 10 kg/day"
  - Toggle buttons above chart: "Day | Week | Month | Year"

- Below chart: "Recent Activities" section heading + "View all →" link
- List of 4 recent activity rows, each row:
  - Category icon in colored circle (green/amber/purple/rose)
  - Activity name: "Drove to work — 24km"
  - Time: "2 hours ago"
  - Carbon value: "+5.2 kg" in mono font
  - Small chevron right

RIGHT COLUMN (35%):
- Section: "Today's Recommendations" heading
- 3 recommendation cards stacked:
  - Each: white card, left accent border in green
  - Icon + title: "Switch to public transit on Tuesdays"
  - Saving chip: "Saves ~8 kg/week" green pill
  - Difficulty: "⭐ Easy"
  - Two action buttons: "✓ Done" (green ghost) + "✕ Skip" (gray ghost)
- "See all recommendations →" green link at bottom

ROW 5 — FULL WIDTH:
- Section: "Active Goals" heading
- 2 goal progress cards side by side:
  - Card: goal title + category tag + progress bar (green, percentage fill)
  - "Reduce transport by 20%" — 67% complete — "13 days left" — amber due indicator
  - "Meatless 3 days/week" — 33% complete — "19 days left"
- "+ Add Goal" dashed-border card with plus icon

ROW 6 — FULL WIDTH:
- Section: "Community Challenge" heading
- Single prominent banner card:
  - Left: 🌱 icon + "June Carbon Challenge" heading + "Ends in 8 days"
  - Center: Leaderboard preview — top 3 users with avatars, names, scores
  - Right: User's rank: "#12 of 847 participants" + current score
  - "View Leaderboard" secondary button

MOBILE LAYOUT (375px):
- No sidebar — bottom tab bar (5 tabs: Home, Log, Insights, Goals, More)
- Stack all sections vertically
- Hero score card full width
- Stat cards: 2x2 grid
- Chart full width
- Recent activities list
- Recommendations collapsed to single card with "3 tips available" expand button
```

---

## PROMPT 5 — Activity Log Page

```
Design the Activity Log page for CarbonTrace carbon footprint tracker.
Desktop 1440px with left sidebar. Mobile 375px.
Same sidebar navigation as dashboard (Log Activity item active).

PAGE LAYOUT: Left sidebar (same as dashboard) + main content

--- PAGE HEADER ---
- H1: "Log Activity"
- Subtext: "What did you do today? We'll calculate the carbon impact."
- Right side: "Import CSV" ghost button + "Quick Log" green button

--- MAIN CONTENT: 2 COLUMN LAYOUT ---

LEFT COLUMN (60%) — LOG FORM:

Step 1 — Category Selection:
- Section label: "1. Choose a category"
- 5 large category cards in a horizontal scrollable row:
  - 🚗 Transport (green)
  - 🍎 Diet (amber)
  - ⚡ Energy (purple)
  - 🛍️ Shopping (blue)
  - ♻️ Waste (teal)
- Each card: icon + label + "avg 38% of footprint" sub-label
- Selected card: green border + green bg tint + checkmark top-right

Step 2 — Activity Type (appears after category selected):
- Section label: "2. Select activity type"
- Dropdown or scrollable chip list for subcategory:
  - If Transport selected: Car (Petrol) | Car (Electric) | Bus | Train | Flight | Motorcycle | Walking/Cycling
  - Each chip shows estimated factor: "Car (Petrol) ~0.21 kg/km"
- Selected chip highlighted green

Step 3 — Quantity Input:
- Section label: "3. Enter quantity"
- Large numeric input, centered, with +/- stepper buttons on sides
- Unit label to the right: "km" / "kg" / "kWh" (auto-set based on activity)
- Slider below input for quick adjustment (0 to max for that category)
- Voice input mic button in corner (Web Speech API hint)

LIVE CARBON PREVIEW (below form, prominent):
- Animated card that updates in real-time as user types
- Shows: carbon flame icon + "= 10.5 kg CO₂e"
- Sub-label: "Equivalent to charging 1,274 smartphones"
- Color shifts: green (low) → amber (moderate) → red (high)

Step 4 — Date & Notes:
- Date picker defaulting to today
- Optional notes textarea: "Add a note (optional)"

Submit button: "Log Activity" full-width green, 52px height
Below: "Or log multiple activities →" link

RIGHT COLUMN (40%) — ACTIVITY HISTORY:

- Section heading: "Today's Log" with total: "12.3 kg so far"
- Filter chips: All | Transport | Diet | Energy | Shopping | Waste
- List of logged activities (today):
  - Each item: category color dot + activity name + time + kg value + edit icon + delete icon
  - Expandable row showing notes if present
  - Delete shows confirmation inline (not modal)
- Empty state (no logs): Illustrated plant icon + "No activities logged yet today. Start above!"

- Below today: "Previous Days" collapsible sections (yesterday, last week)
  - Date heading + total carbon for that day
  - List of activities

MOBILE:
- Full-screen step-by-step wizard instead of 2-column layout
- Category selection as large tappable cards 2x2 + 1
- Prominent live carbon preview between steps
- History accessible via "View History" tab at bottom
```

---

## PROMPT 6 — Insights & Analytics Page

```
Design the Insights & Analytics page for CarbonTrace.
Data visualization focused. Desktop 1440px + mobile 375px.
Left sidebar, "Insights" nav item active.

--- PAGE HEADER ---
H1: "Your Insights"
Subtext: "Understand your patterns. Find your biggest wins."
Right: Period selector dropdown — "Last 30 days ▼" | Date range picker button

--- ROW 1: SUMMARY STATS BAR (4 cards) ---
- Total Carbon: "342 kg CO₂e" — "This month" — "↓ 18% vs last month" green trend
- Best Day: "3.2 kg" — "Last Tuesday" — leaf icon
- Worst Category: "Transport 42%" — amber icon
- Goal Progress: "67% complete" — circular mini progress ring

--- ROW 2: MAIN TREND CHART (full width card) ---
- Card heading: "Carbon Trend" with period toggle: Day | Week | Month | Year
- Large area chart (1200px wide, 320px tall):
  - X-axis: dates for selected period
  - Y-axis: kg CO₂e
  - Multi-line if categories toggled: separate colored lines per category
  - Area fill under main line (gradient green, fading to transparent)
  - Dashed goal line in gray: "Your Goal"
  - National average line in red dashes
  - Interactive tooltip on hover: date + total + breakdown by category
- Top-right of chart: toggle checkboxes for each category line (color-coded)
- Annotation pin on chart: "Joined challenge here" type markers

--- ROW 3: TWO COLUMN ---

LEFT (55%): CATEGORY BREAKDOWN CARD
- Heading: "Breakdown by Category"
- Large donut chart, center label: "342 kg" + "total"
- Right of chart: legend list
  - Color swatch + category name + kg value + percentage + trend arrow
  - Transport: 144 kg | 42% | ↓ 8%
  - Diet: 98 kg | 29% | ↑ 3%
  - Energy: 62 kg | 18% | ↓ 12%
  - Shopping: 26 kg | 8% | —
  - Waste: 12 kg | 3% | ↓ 5%
- Toggle: "By Mass (kg)" | "By % of Total"

RIGHT (45%): COMPARISONS CARD
- Heading: "How You Compare"
- 3 comparison rows, each a horizontal bar chart:
  - Row 1: "vs. Global Average" — your bar (green, short) vs. gray bar (full)
    Label: "You emit 61% less than the global average"
  - Row 2: "vs. National Average" — similar layout
    Label: "38% below [Country] average"
  - Row 3: "vs. Your Past Self" — this month vs. last month
    Label: "↓ 18% improvement month over month" in green

--- ROW 4: CARBON EQUIVALENTS (full width) ---
- Heading: "What your emissions look like in real terms"
- 4 visual equivalence cards in a row:
  - 🚗 "= Driving 2,156 km in a petrol car"
  - 📱 "= Charging 41,300 smartphones"
  - 🌳 "= 15 trees needed to absorb this in a year"
  - ✈️ "= 0.4 short-haul flights"
- Each card: large illustrated icon + equivalence text, white bg, green accent

--- ROW 5: WEEKLY HEATMAP (full width) ---
- Heading: "Activity Heatmap — Last 12 Weeks"
- GitHub-style contribution heatmap:
  - X axis: 12 weeks (columns)
  - Y axis: Mon–Sun (rows)
  - Cell color: white (no log) → light green → medium green → dark green (based on carbon logged)
  - Hover tooltip: "June 3: 12.4 kg logged — 4 activities"
- Legend below: "Less" — empty squares → filled green squares — "More"

--- ROW 6: TOP REDUCTION OPPORTUNITIES ---
- Heading: "Your Biggest Reduction Opportunities"
- 3 cards in a row, each showing:
  - Category icon + "If you switched X to Y"
  - Large potential saving: "Save up to 45 kg/month"
  - Estimated as: "= 13% of your current footprint"
  - "See how →" green link
  - Difficulty tag: Easy / Moderate / Hard

MOBILE: Single column. Charts 100% width. Heatmap scrollable horizontally.
```

---

## PROMPT 7 — Goals Page

```
Design the Goals & Progress Tracking page for CarbonTrace.
Desktop 1440px + mobile 375px. Left sidebar, "Goals" nav active.

--- PAGE HEADER ---
H1: "Your Goals"
Subtext: "Commit to reductions. Track your progress automatically."
Right: "+ New Goal" primary green button

--- ROW 1: GOALS SUMMARY STRIP ---
3 inline stats:
- Active Goals: "3" with target icon
- Completed: "7" with checkmark — green
- Success Rate: "78%" with trophy icon — amber

--- SECTION: ACTIVE GOALS ---
Section heading: "Active Goals (3)"
3 goal cards in a row (or 2+1 row):

Each Goal Card (white, 16px radius, hover shadow):
Top section:
  - Category tag (colored pill): e.g., "🚗 Transport"
  - Status badge top-right: "On Track" (green) or "At Risk" (amber) or "Behind" (red)
  - Goal title: "Reduce commute emissions by 20%" — H3

Middle section:
  - Circular progress ring (large, 80px diameter):
    - Percentage inside: "67%"
    - Ring filled green to completion point
  - To the right of ring:
    - "Saved so far: 28 kg CO₂e"
    - "Target: 42 kg CO₂e"
    - "Started: May 14, 2026"
  - Linear progress bar below: green fill, percentage label

Bottom section:
  - Left: "⏱ 13 days remaining" (amber if < 7 days)
  - Right: "Edit" ghost button + "Mark Complete" green ghost button
  - Expandable section: "Show daily breakdown" chevron

--- SECTION: CREATE NEW GOAL MODAL (shown inline as a card for design purposes) ---
Card with dashed green border:
- Heading: "Create a New Goal"
- Step form:
  Step 1: Category selector (same chips as log page)
  Step 2: Goal type radio:
    - "Reduce by percentage" (e.g., 20%)
    - "Reduce to target amount" (e.g., under 5 kg/day)
    - "Log every day for X days" (streak goal)
  Step 3: Target value input with unit
  Step 4: Deadline date picker
  Step 5: Reminder frequency: Daily | Weekly | None
- Preview card showing: "You're committing to reduce [category] by [X%] in [Y days]"
- "Set Goal" green button + "Cancel" ghost button

--- SECTION: COMPLETED GOALS ---
Section heading: "Completed Goals (7)" with toggle to show/hide
Compressed list view, each row:
- Green checkmark circle + goal title + "Completed June 2, 2026" + "Saved 38 kg" badge
- Hover expands to show chart of progress over goal duration

--- SECTION: GOAL SUGGESTIONS ---
Section heading: "Suggested Goals — Based on Your Activity"
Subtext: "AI-analyzed your last 30 days and found these opportunities:"
3 suggestion cards in a row:
- Light green bg, leaf icon, suggested goal text
- Potential saving chip: "Could save ~32 kg/month"
- "Set this goal" button

MOBILE: Cards full width, stacked. Progress rings smaller (60px). Modals become bottom sheets.
```

---

## PROMPT 8 — Community & Challenges Page

```
Design the Community & Challenges page for CarbonTrace.
Social, energetic feel while staying in the green brand palette.
Desktop 1440px + mobile 375px. Left sidebar, "Community" nav active.

--- PAGE HEADER ---
H1: "Community"
Subtext: "Climate action is better together. Join a challenge, climb the board, make an impact."
Right: "Invite Friends" secondary button + share icon

--- ROW 1: USER'S CHALLENGE STATUS CARD (full width, prominent) ---
Gradient card (dark green background, white text):
- Left: "🏆 You're #12 of 847 in June Carbon Challenge"
- Center: Progress bar showing position in top percentile
  "Top 15% of all participants this month"
- Right: User's current score: "156 kg saved" + "8 days left in challenge"
- Bottom strip: 7-day activity contribution mini chart

--- ROW 2: ACTIVE CHALLENGES (tab: Featured | My Challenges | Completed) ---

FEATURED CHALLENGES (3 cards in a row):
Each challenge card:
- Hero image area (illustrated icon/pattern, category color bg)
- Challenge name: "June Meatless Challenge" — H3
- Description: 1-sentence summary
- Stats row: "🧑‍🤝‍🧑 847 participants" | "⏱ 8 days left" | "🌱 Avg 23 kg saved"
- If already joined: green "Joined ✓" badge top-right + progress bar
- If not joined: "Join Challenge" green button

Special "Create Team Challenge" card (dashed border):
- Plus icon + "Create a private team challenge"
- "Invite your colleagues or friends"
- "Start Challenge" button

--- ROW 3: LEADERBOARD (2 column) ---

LEFT (55%): GLOBAL LEADERBOARD CARD
- Heading: "June Challenge Leaderboard"
- Sub-tabs: Global | Country | Friends
- Top 3 podium visual:
  - 2nd place: silver circle avatar, name, score — positioned slightly lower
  - 1st place: gold crown icon + larger gold circle avatar, name, score — center elevated
  - 3rd place: bronze circle avatar, name, score — positioned lower
- List below podium: rank 4–10
  Each row: rank number | avatar | name | "kg saved" | trend arrow
- Divider with "..." 
- Highlighted row: "You — #12 — 156 kg saved" with green highlight bg
- "View Full Leaderboard" link

RIGHT (45%): FRIENDS ACTIVITY FEED
- Heading: "Friends' Activity"
- "Connect with friends" prompt if no friends yet — with "Find Friends" button
- Feed items (if friends connected):
  - Avatar + "[Friend] logged a 15km bike ride — saved 3.2 kg" — "2h ago"
  - Avatar + "[Friend] completed goal: Meatless Week" — achievement badge — "1d ago"
  - Avatar + "[Friend] joined June Challenge" — "3d ago"
- Each feed item has a 👍 "Nice!" reaction button

--- ROW 4: BADGES & ACHIEVEMENTS (full width) ---
Heading: "Your Badges"
Horizontal scrollable row of achievement badges:
- Earned badges (full color, solid): 
  - 🔥 "14-Day Streak", 🌱 "First Log", ✅ "Goal Crusher", 🥗 "Meat-Free Week"
- Locked badges (grayed out, blurred):
  - 🌍 "Carbon Neutral Month" — "Log 0 net emissions for a full month"
  - 🏃 "Marathon Saver" — "Save 100kg in a single month"
  - ♻️ "Full Circle" — "Log all 5 categories in one day"
- Badge tap/click expands a detail popup: name, criteria, how close user is

MOBILE: Full width cards. Leaderboard + friends stacked vertically. Badges in horizontal scroll.
```

---

## PROMPT 9 — Learn / Education Hub Page

```
Design the Education Hub page for CarbonTrace. 
Content-rich but approachable — like a modern editorial/blog layout.
Desktop 1440px + mobile 375px. Left sidebar, "Learn" active.

--- PAGE HEADER ---
H1: "Learn"
Subtext: "Understand the science behind your score. Knowledge drives better choices."
Search bar (full width, with magnifier icon): "Search articles, videos, glossary..."

--- TABS (below header): Articles | Videos | Glossary | Myth vs. Fact ---

--- ARTICLES TAB (default) ---

FEATURED ARTICLE (full width card, editorial style):
- Large hero image area (illustrated landscape, not photo) with green tint overlay
- Article category tag: "ENERGY" green pill
- Title: "Why your electricity's carbon intensity changes every hour — and what to do about it"
- Author + date: "CarbonTrace Science Team · May 28, 2026"
- Estimated read: "5 min read"
- "Read Article →" button

FILTER CHIPS ROW:
All | Transport | Diet | Energy | Shopping | Waste | Climate Science | Policy

ARTICLE GRID (3-column, then loads more):
Each article card:
- Illustration/icon area (category color gradient bg)
- Category tag (colored pill)
- Title (H3, 2 lines max)
- Excerpt (2 sentences)
- Read time + date
- Hover: title underlines, card lifts

--- VIDEOS TAB ---
Grid of video cards:
Each card:
- Thumbnail area with play button overlay
- YouTube embed indicator
- Duration badge (e.g., "4:32")
- Video title + channel name
- "Plays in this app" label (iframe embed)

--- GLOSSARY TAB ---
- Search/filter bar at top
- Alphabetical index (A B C D ... Z) — click jumps to section
- Each term: bold term + definition + "related: [linked terms]"
- Terms like: Carbon Footprint, CO₂ Equivalent, Emission Factor, IPCC, Net Zero, Scope 1/2/3, Carbon Credit, etc.
- Each definition card: white bg, subtle left border in green

--- MYTH VS. FACT TAB ---
Interactive flip cards (3 per row):
Each card — front:
- Red "MYTH" badge
- Myth statement in italic: "Recycling is the most impactful thing I can do"
Each card — back (click to flip):
- Green "FACT" badge
- Fact: "Transport and diet have 10x more impact than recycling for most people."
- Source citation: "Source: IPCC AR6, 2021"
- "Learn more →" link

MOBILE: Single column. Tabs become a horizontal scrollable chip row. Video cards full width.
```

---

## PROMPT 10 — Settings Page

```
Design the Settings & Profile page for CarbonTrace.
Clean, organized, utilitarian layout — not flashy, just functional.
Desktop 1440px + mobile 375px. Left sidebar, "Settings" nav active.

--- PAGE HEADER ---
H1: "Settings"
Save/discard action buttons top-right (appear when unsaved changes exist)

--- LAYOUT: SETTINGS NAV + CONTENT PANEL (2 column) ---

LEFT SETTINGS NAVIGATION (200px):
Vertical list of sections (active section highlighted green):
- 👤 Profile
- 🔔 Notifications
- 🌍 Location & Factors
- 🎨 Appearance
- 🔒 Privacy & Security
- 📥 Data & Export
- ❌ Account

--- PROFILE SECTION ---
Avatar section:
- Large circle avatar (80px) with "Edit photo" overlay on hover
- Upload button + "Remove photo" link below

Form fields:
- Display Name (text input)
- Email (text input, readonly if Google auth — "Managed by Google" label)
- Bio / About (short textarea, 160 char limit)

Lifestyle settings (affects emission factor weighting):
- Country/Region dropdown
- Lifestyle type radio (same options as onboarding)
- Vegetarian/Vegan toggle (affects diet emission factors)

"Save Profile" green button at bottom

--- NOTIFICATIONS SECTION ---
Section heading: "Notifications"
Toggle list — each row: icon + label + description + toggle switch
- 🔔 Daily reminder to log activities — "Remind me at [time picker]" — toggle ON
- 📊 Weekly carbon summary email — toggle ON
- 🏆 Challenge milestones — "When I reach 25%, 50%, 75%" — toggle ON
- 🎯 Goal deadline reminders — "3 days before a goal deadline" — toggle ON
- 💡 New recommendations available — toggle OFF
- 📣 New community challenges — toggle OFF
- Marketing emails section (separate, with "Unsubscribe all" link)

--- APPEARANCE SECTION ---
Theme selector:
- 3 large selectable cards side by side:
  - Light mode (white card, sun icon, currently active)
  - Dark mode (dark card, moon icon)
  - System default (split card, monitor icon)

Accent color selector (optional):
- 6 color swatches — green selected by default
- Note: "Accessibility-safe colors only"

--- DATA & EXPORT SECTION ---
"Your Data" heading + GDPR notice paragraph
Two action cards:
- Card 1: Download icon + "Export Your Data" + "Download all your logs, goals, and profile as JSON" + "Request Export" button
- Card 2: Document icon + "Export Carbon Report" + "Get a PDF report of your monthly carbon footprint" + "Generate Report" green button

--- ACCOUNT / DANGER ZONE ---
Red-tinted section:
- "Delete Account" heading
- Warning text: "This will permanently delete all your data. This cannot be undone."
- "Delete My Account" red destructive button
- Clicking shows confirmation modal: type "DELETE" to confirm

MOBILE: Settings nav becomes a full-screen list first, tapping a section navigates to full-screen panel.
```

---

## PROMPT 11 — Carbon Offset Marketplace Page

```
Design the Carbon Offset Marketplace page for CarbonTrace.
Trustworthy, informative — like a curated ethical marketplace.
Desktop 1440px + mobile 375px. Left sidebar (accessible from sidebar "Offset" link).

--- PAGE HEADER ---
H1: "Offset Your Footprint"
Subtext: "Couldn't reduce it? Offset it. Every verified tonne of CO₂ offset funds real climate projects."
Disclaimer banner (amber tint): ⚠️ "Offsetting complements, but doesn't replace, reduction. We recommend reducing first."

--- ROW 1: YOUR OFFSET CALCULATOR (prominent card, green gradient) ---
- Left: "Your monthly footprint: 156 kg CO₂e"
  Sub: "To offset your full month, you need: 0.156 tonnes"
- Center: Estimated cost range: "≈ $2.50 – $6.00 USD" (range across providers)
- Right: "Find Offsets" green button
- Below: Progress note: "You've already reduced 18% this month — only offset the remainder!"

--- ROW 2: FILTER BAR ---
Filter chips: All Projects | Forestry | Renewable Energy | Ocean | Community | Gold Standard | VCS Certified

--- ROW 3: PROJECT CARDS GRID (3 column) ---
Each offset project card:
- Top: Project illustration/map thumbnail (colored illustration, not photo)
- Certification badge: "Gold Standard ✓" or "VCS Certified ✓" — green/blue badge top-right
- Project type tag: "Reforestation | Renewable | Ocean"
- Project name: "Amazon Reforestation Project — Brazil"
- Description: 2 sentences about the project
- Stats row:
  - "🌳 42,000 trees planted"
  - "📍 Pará, Brazil"
  - "🏷️ From $4.20/tonne"
- Impact meter: "Verified tonnes retired this year: 12,400"
- Two buttons: "Learn More" (ghost) + "Offset Now →" (green, opens external link in new tab)

--- ROW 4: HOW IT WORKS STRIP ---
3-step horizontal explainer (same style as landing page How It Works):
1. "Calculate" — We calculate your remaining footprint after reductions
2. "Choose" — Pick a verified project you believe in
3. "Offset" — Purchase credits directly from our trusted partners

--- ROW 5: ALREADY OFFSET (if user has offset before) ---
"Your Offset History" section:
Table: Date | Project | Amount Offset | Cost | Certificate
Empty state: illustrated tree + "No offsets yet — every tonne counts!"

MOBILE: Single column. Filter chips horizontal scroll. Cards full width.
```

---

## PROMPT 12 — Notifications / Alerts Panel

```
Design the Notifications panel for CarbonTrace.
This appears as a slide-in drawer from the right when the bell icon is clicked.
Width: 400px panel on desktop. Full screen on mobile.

--- PANEL HEADER ---
"Notifications" H2 heading
"Mark all as read" text link right-aligned
X close button top-right corner

--- TABS: All | Unread | Challenges | Goals | System ---

--- NOTIFICATION LIST ---
Group by date: "Today", "Yesterday", "This Week"

Notification types (with icons and color coding):
1. 🔥 STREAK: "Your 14-day streak is going strong! Log today to keep it alive." — Amber bg tint — "2h ago"
2. 🏆 CHALLENGE: "You've moved to #12 in June Challenge! You're in the top 15%." — Green tint — "4h ago"
3. 🎯 GOAL: "You're 75% of the way to your transport goal — great progress!" — Green tint — "Yesterday"
4. 💡 RECOMMENDATION: "New AI recommendation: Switching Tuesday commute to train could save 8 kg/week." — Blue tint — "Yesterday"
5. ⚠️ ALERT: "Your energy usage today is higher than usual — 3x your average." — Amber tint — "2 days ago"
6. ✅ ACHIEVEMENT: "You earned the 'Meat-Free Week' badge!" — Celebration confetti mini icon — "3 days ago"

Each notification row:
- Left: colored icon circle
- Middle: notification text (bold first line, normal weight description)
- Right: timestamp + unread blue dot (if unread)
- Tap/click: navigates to relevant page + marks as read

Empty state: illustrated bell + "You're all caught up! No new notifications."

Footer of panel:
"Notification Settings →" link
```

---

## PROMPT 13 — Mobile App View (375px — Full Set)

```
Design the complete mobile experience for CarbonTrace at 375px width.
Native app-like feel — bottom navigation, full-screen pages, bottom sheet modals.
iOS-inspired but accessible and web-native.

GLOBAL MOBILE ELEMENTS:
- Status bar area at top: 44px (safe area)
- Bottom tab bar: 82px including safe area
  Tabs (5): Home 🏠 | Log ➕ | Insights 📊 | Goals 🎯 | More ···
- Active tab: green icon + green label
- Center "Log" tab: larger green circle button (+) elevated above bar (FAB style)

--- MOBILE SCREEN 1: DASHBOARD ---
- Greeting: "Good morning, Marcus 👋" + notification bell right
- Carbon score card: full width, green gradient, shows today's score large
- 4 category stat chips in 2x2 grid (compact)
- "This Week" line chart — full width, 180px height
- "Quick Actions" row: 4 icon buttons: Log, Goals, Community, Learn
- Recent activity feed: 3 items visible + "See all" link

--- MOBILE SCREEN 2: LOG ACTIVITY (FAB tap) ---
Bottom sheet slides up (full screen):
- Handle bar at top
- Title: "Log Activity"
- Category selection: large cards, 2 per row
- After category: subcategory horizontal chip scroll
- Quantity: large centered input with +/– buttons
- Live carbon preview: prominent, color-changing
- "Log It" full-width green button sticky at bottom

--- MOBILE SCREEN 3: INSIGHTS ---
- Period toggle at top: Today | Week | Month | Year
- Score summary cards: horizontal scroll (peeks next card)
- Area chart: full width, 200px
- Category breakdown: donut chart centered + legend list below
- Comparison bars: full width

--- MOBILE SCREEN 4: GOALS ---
- Active goals: vertical card stack
- Progress rings: 60px
- "+ New Goal" floating button bottom-right
- Completed goals: collapsible section

--- MOBILE SCREEN 5: MORE MENU ---
Full screen list:
- User profile header with avatar + name + streak
- Menu items: Community, Learn, Offset, Settings, Help, Sign Out
- Each item: icon + label + chevron
- Version info at bottom

MOBILE INTERACTIONS TO SHOW:
- Bottom sheet modal for Log Activity
- Swipe to delete activity (log page)
- Pull to refresh on dashboard
- Haptic feedback indicator on carbon score update (show as animation)
```

---

## PROMPT 14 — Error States & Empty States

```
Design the error and empty state screens for CarbonTrace.
Friendly, illustrated, brand-consistent — never a blank page or raw error text.
Show these as a set of component examples on one canvas.

--- EMPTY STATES (6 variants) ---

1. NO ACTIVITIES LOGGED TODAY (Dashboard):
- Illustration: small sprout plant in a pot, minimal linework, green
- Heading: "Your carbon story starts here"
- Subtext: "Log your first activity today — takes under 2 minutes."
- CTA Button: "Log First Activity" green

2. NO GOALS SET (Goals page):
- Illustration: empty target/bullseye
- Heading: "No goals yet"
- Subtext: "Set a carbon reduction goal and track your progress automatically."
- CTA: "Set My First Goal" green

3. NO FRIENDS/COMMUNITY (Community page):
- Illustration: two outlined people figures with dotted connection
- Heading: "Better together"
- Subtext: "Invite friends to compare footprints and join team challenges."
- CTA: "Invite Friends" green

4. NO RECOMMENDATIONS (Recommendations panel):
- Illustration: light bulb with leaf inside
- Heading: "Recommendations loading"
- Subtext: "Our AI is analyzing your last 30 days. Check back tomorrow."
- No CTA — just a subtle loading pulse animation

5. NO OFFSET HISTORY:
- Illustration: tree outline, uncolored
- Heading: "No offsets yet"
- Subtext: "Browse verified projects and offset what you couldn't reduce."
- CTA: "Browse Projects" green

6. SEARCH NO RESULTS (Learn page):
- Illustration: magnifying glass finding nothing
- Heading: "No results for '[query]'"
- Subtext: "Try different keywords or browse by category."
- CTA: "Clear Search" ghost

--- ERROR STATES (4 variants) ---

7. OFFLINE / NO CONNECTION:
- Illustration: wifi icon with X and cloud
- Heading: "You're offline"
- Subtext: "Your activity logs will sync automatically when you reconnect."
- Info: "You can still log activities — they'll sync when back online."
- No CTA — shows a subtle "reconnecting..." pulse indicator

8. FIRESTORE LOAD ERROR:
- Illustration: broken/cracked chart icon
- Heading: "Couldn't load your data"
- Subtext: "Something went wrong on our end. We're looking into it."
- CTA: "Try Again" secondary button
- Link: "Check status page" small text

9. AUTH ERROR (Login failed):
- Inline in the login form — red banner at top of form
- Icon: alert-circle
- Text: "Incorrect email or password. Please try again." or "This Google account isn't linked to CarbonTrace. Sign up first."
- No full-page error for auth — keep user in the form flow

10. 404 NOT FOUND:
- Full page, centered layout
- Large illustrated forest path that leads to a question mark
- Heading: "Oops — trail not found"
- Subtext: "This page doesn't exist, or you may not have access to it."
- CTA: "Go to Dashboard" green + "Go Back" ghost

STYLE NOTES FOR ALL ILLUSTRATIONS:
- Minimalist line art + subtle color fills (brand greens + amber + white)
- Consistent 2px stroke weight, rounded line caps
- Each illustration: max 200px wide, centered
- Illustrations feel hand-drawn but clean — not emoji, not stock photos
```

---

## QUICK REFERENCE — Page Inventory

| # | Page | Prompt |
|---|------|--------|
| 0 | Design System & Brand Tokens | Prompt 0 |
| 1 | Landing Page (Marketing) | Prompt 1 |
| 2 | Login & Register | Prompt 2 |
| 3 | Onboarding Wizard (3 steps) | Prompt 3 |
| 4 | Main Dashboard | Prompt 4 |
| 5 | Activity Log Page | Prompt 5 |
| 6 | Insights & Analytics | Prompt 6 |
| 7 | Goals & Progress | Prompt 7 |
| 8 | Community & Challenges | Prompt 8 |
| 9 | Learn / Education Hub | Prompt 9 |
| 10 | Settings & Profile | Prompt 10 |
| 11 | Carbon Offset Marketplace | Prompt 11 |
| 12 | Notifications Panel | Prompt 12 |
| 13 | Mobile Views (Full Set) | Prompt 13 |
| 14 | Error & Empty States | Prompt 14 |

---

## Tips for Best Results in Google Stitch

1. **Always run Prompt 0 first** — Stitch uses it as the style anchor for all subsequent generations.
2. **Reference previous frames** — In each prompt, mention "Use the same sidebar, colors, and typography from the dashboard frame."
3. **Iterate with specifics** — If a component doesn't look right, add: "Make the carbon score number larger, JetBrains Mono font, 48px."
4. **Request variants** — Append "Also show an empty state version of this screen" to get both states in one generation.
5. **Mobile prompts** — Stitch handles mobile well — always specify "375px mobile view" and mention "bottom tab bar navigation."
6. **Component extraction** — After generating pages, ask Stitch: "Extract the recommendation card as a standalone reusable component."
7. **Dark mode** — Append "Also generate a dark mode variant, background #1c1917, cards #292524" to any prompt.
