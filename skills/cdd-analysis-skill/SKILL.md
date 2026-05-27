---
name: cdd-analysis-skill
version: "1.0.0"
description: >
  Pre-processes an HTML prototype directory for Component-Driven Development (CDD).
  Runs a parsing script to inject cdd-id attributes, deduplicates elements via
  content-hashing, classifies them as Atoms / Molecules / Organisms according to
  Atomic Design, consolidates recurring components, and maintains a
  workflow-progress.json checkpoint file so cheap downstream LLMs can generate
  React Native components without exceeding their token budget.
target_framework: react-native
prototype_root: docs/ui/prototypes/workout-tracker
script: skills/cdd-analysis-skill/scripts/deduplicate_and_parse.py
references:
  workflow_progress_template: skills/cdd-analysis-skill/references/workflow-progress.template.json
  deduplicated_components_template: skills/cdd-analysis-skill/references/deduplicated-components.template.json
output_files:
  workflow_progress: workflow-progress.json
  components_snapshot: deduplicated-components.json
tags: [cdd, atomic-design, react-native, html-conversion, pre-processing]
---

# CDD Analysis Skill — Agent Instruction Manual

## 0. Overview & Token-Budget Contract

You are the **Manager Agent** for a Component-Driven UI pipeline.
Your job is to orchestrate, classify, and checkpoint — NOT to read raw HTML directly.

**Token budget rule:** Never load more than ONE HTML file into your context at a time.
Always delegate file-system work to the script. Trust its JSON output as ground truth.

---

## 1. Execution Order (run once per prototype update)

```
Step 1  →  Run the script          →  produces raw-elements.json
Step 2  →  Classify elements       →  atoms / molecules / organisms
Step 3  →  Consolidate duplicates  →  canonical component list
Step 4  →  Write checkpoint        →  workflow-progress.json
Step 5  →  Emit conversion tasks   →  per-component task list for downstream LLMs
```

---

## 2. Step 1 — Run the Pre-Processing Script

Execute the following command from the repository root:

```bash
python skills/cdd-analysis-skill/scripts/deduplicate_and_parse.py \
  --input  docs/ui/prototypes/workout-tracker \
  --output raw-elements.json
```

The script returns a JSON array. Each entry has this shape:

```jsonc
{
  "cdd_id":    "atm-btn-01",          // injected data attribute
  "tag":       "button",              // original HTML tag
  "classes":   ["btn-primary"],       // CSS class list
  "text":      "Create Free Account", // visible text content (trimmed)
  "attrs":     { "href": "..." },     // other relevant attributes
  "source":    "auth/landing.html",   // originating file
  "hash":      "a3f9c1d2",            // content hash (8 chars, SHA-256 prefix)
  "is_duplicate": false,              // true when hash seen before
  "canonical_ref": null               // if duplicate: cdd_id of canonical element
}
```

**Do not classify before the script finishes.**

---

## 3. Step 2 — Classification Rules (Atomic Design)

Apply rules in this exact order. The first matching rule wins.

### 3.1 Atoms — Single-purpose, no children of interest

Classify as **Atom** when ALL of the following are true:
- The element is one of: `button`, `input`, `label`, `img`, `span`, `a`, `p`, `h1`–`h6`, `svg`, `textarea`, `select`
- It contains NO classified sub-elements (i.e., no children that would themselves be an Atom or higher)
- It carries a single semantic role (label, action, image, text)

**Atom prefix:** `atm-`

| HTML Pattern | Atom Name |
|---|---|
| `<button>` / `<a class="btn-*">` | `Button` |
| `<input>` | `TextInput` |
| `<label>` / `<span class="*-label">` | `Label` |
| `<img>` / `<svg>` | `Icon` or `Image` |
| `<h1>`–`<h3>` | `Heading` |
| `<p>` / `<span>` (text only) | `BodyText` |
| `<div class="*-badge">` | `Badge` |
| `<div class="*-avatar">` | `Avatar` |
| `<div class="progress-fill">` | `ProgressIndicator` |
| `<div class="strength-segment">` | `StrengthBar` |
| `<div class="bar">` | `ChartBar` |

### 3.2 Molecules — Composed of 2–5 Atoms with a single cohesive function

Classify as **Molecule** when:
- The element contains 2–5 child Atoms
- The group performs one clear UI function (e.g., labelled input, icon+text row, stat block)
- It does NOT contain other Molecules

**Molecule prefix:** `mol-`

| HTML Pattern | Molecule Name |
|---|---|
| `<div class="field">` (label + input) | `FormField` |
| `<div class="stat-card">` (icon + value + label) | `StatCard` |
| `<div class="workout-vol">` (value + unit) | `VolumeDisplay` |
| `<div class="exercise-num">` + name + detail | `ExerciseRow` |
| `<div class="streak-dot">` group | `StreakDot` |
| `<div class="feature-chip">` (icon + label) | `FeatureChip` |
| `<div class="checkbox-row">` (checkbox + text) | `CheckboxField` |
| `<div class="workout-icon">` + info + vol | `WorkoutListItem` |
| Social button (icon + label text) | `SocialButton` |
| `<div class="tag">` | `Tag` |

### 3.3 Organisms — Complex UI blocks composed of Molecules (and Atoms)

Classify as **Organism** when:
- The element contains ≥2 Molecules (or ≥6 Atoms) OR represents a discrete screen section
- It maps directly to a React Native `<View>` with significant layout logic

**Organism prefix:** `org-`

| HTML Pattern | Organism Name |
|---|---|
| `<nav class="nav">` / `.topbar` | `NavigationBar` |
| `<header class="header">` | `AppHeader` |
| `<div class="hero">` | `HeroSection` |
| `<div class="stats-row">` | `StatsRow` |
| `<div class="streak-banner">` | `StreakBanner` |
| `<div class="today-card">` | `TodayWorkoutCard` |
| `<div class="form-container">` | `AuthForm` |
| `<div class="cta-group">` | `CTAGroup` |
| `<div class="chart-card">` | `VolumeChart` |
| `<a class="workout-card">` | `WorkoutHistoryCard` |
| `<nav class="bottom-nav">` | `BottomNavBar` |

---

## 4. Step 3 — Consolidation (Deduplication)

After classification, merge all elements with matching `hash` values:

1. **Canonical element:** The first occurrence (lowest cdd_id number) is canonical.
2. **Duplicates:** All later occurrences set `is_duplicate: true` and reference the canonical's `cdd_id` in `canonical_ref`.
3. **Consolidation rule:** One canonical element → ONE React Native component.
   Downstream LLMs generate code only for canonical elements.
4. **Near-duplicates** (same tag + same classes, text differs): Create one parameterized component
   where the differing text becomes a `prop`. Mark with `is_parameterized: true`.

Output the consolidated list to `deduplicated-components.json`.

### React Native Mapping Table

| HTML Tag | React Native Component |
|---|---|
| `<div>`, `<section>`, `<nav>` | `<View>` |
| `<p>`, `<span>`, `<h1>`–`<h6>`, `<label>` | `<Text>` |
| `<button>`, `<a>` (interactive) | `<TouchableOpacity>` + `<Text>` |
| `<input type="text/email/password">` | `<TextInput>` |
| `<img>` | `<Image>` |
| `<svg>` | `react-native-svg` → `<Svg>` |
| `<ul>`/`<ol>` | `<FlatList>` or `<ScrollView>` |
| `<form>` | `<View>` (no native form) |
| CSS class styles | `StyleSheet.create({})` |
| CSS variables (`:root`) | theme constants |

---

## 5. Step 4 — Workflow Checkpointing

After every run, update `workflow-progress.json` with the current state.

### 5.1 File Structure

See `references/workflow-progress.template.json` for the full schema.

Key fields:

```jsonc
{
  "meta": {
    "last_run": "<ISO-8601 timestamp>",
    "script_version": "1.0.0",
    "prototype_root": "docs/ui/prototypes/workout-tracker"
  },
  "file_hashes": {
    // SHA-256 hash of each HTML file — used for delta detection
    "auth/landing.html": "<hash>",
    "auth/registration.html": "<hash>",
    "auth/login.html": "<hash>",
    "overview/overview.html": "<hash>"
  },
  "components": {
    // keyed by cdd_id, value is the component status object
  }
}
```

### 5.2 Delta-Update Rules

When the script runs again:

1. **Compute new file hashes** for all HTML files.
2. **Compare** with `file_hashes` stored in `workflow-progress.json`.
3. For each file where `new_hash != stored_hash`:
   a. Re-parse only that file (call script with `--input <single-file>`)
   b. For each element whose `hash` changed: set `conversion_status` → `"needs_regeneration"`
   c. Propagate the `"needs_regeneration"` flag UP the dependency chain:
      - If an Atom changes → all Molecules that `depends_on` it → `"needs_regeneration"`
      - If a Molecule changes → all Organisms that `depends_on` it → `"needs_regeneration"`
4. Components whose hash did NOT change remain at their current status.
5. Update `file_hashes` with the new values.
6. Update `meta.last_run`.

### 5.3 Component Status Values

| Status | Meaning |
|---|---|
| `"pending"` | Not yet converted |
| `"in_progress"` | Currently being generated by downstream LLM |
| `"done"` | React Native component generated and verified |
| `"needs_regeneration"` | Source changed since last generation |
| `"skipped"` | Intentionally excluded (e.g., decorator-only element) |

---

## 6. Step 5 — Emit Conversion Tasks

After checkpointing, output a conversion task list. Format for each task:

```jsonc
{
  "task_id": "convert-atm-btn-01",
  "priority": 1,                        // Atoms first, then Molecules, Organisms last
  "component": {
    "cdd_id": "atm-btn-01",
    "type": "Atom",
    "name": "Button",
    "rn_component": "TouchableOpacity",
    "props": ["label", "onPress", "variant"],
    "depends_on": []
  },
  "instruction": "Generate a React Native <TouchableOpacity> component named Button. It must accept props: label (string), onPress (function), variant ('primary'|'secondary'). Use StyleSheet. Import from react-native only. No external libraries. Refer to cdd_id atm-btn-01 for the source element."
}
```

**Priority order:** Atoms (1) → Molecules (2) → Organisms (3)
Downstream LLMs receive tasks in priority order to ensure dependencies are built first.

---

## 7. Strict Agent Rules

1. **Never hallucinate cdd_ids.** Only use IDs returned by the script.
2. **Never classify without script output.** Classifications come after Step 1.
3. **Never generate React Native code yourself.** That is the downstream LLM's job.
4. **Never load more than one HTML file** into your context window at once.
5. **Always write workflow-progress.json** before reporting task completion.
6. **Use only canonical elements** for conversion tasks; skip duplicates.
7. When uncertain between Molecule and Organism, count child elements: ≤5 Atoms → Molecule.
