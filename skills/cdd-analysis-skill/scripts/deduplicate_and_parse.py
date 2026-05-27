#!/usr/bin/env python3
"""
CDD Pre-Processing Script
Aufgabe 1: ID-Injektion, Deduplizierung und JSON-Output für den Manager Agent.

Usage:
    python deduplicate_and_parse.py --input <prototype-dir> --output <output.json>
    python deduplicate_and_parse.py --input <single-file.html> --output <output.json>
"""

import argparse
import hashlib
import json
import os
import re
import sys
from pathlib import Path
from html.parser import HTMLParser

# ── Constants ──────────────────────────────────────────────────────────────────

# Tags whose content is not visible in a rendered browser view
INVISIBLE_TAGS = {
    "head", "script", "style", "meta", "link", "title", "noscript",
    "template", "base", "area", "param", "col", "colgroup", "source",
    "track", "wbr", "br",
}

# Tags that carry visible, classifiable content
VISIBLE_TAGS = {
    "a", "article", "aside", "blockquote", "button", "canvas", "caption",
    "code", "dd", "details", "dialog", "div", "dl", "dt", "em", "fieldset",
    "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5",
    "h6", "header", "img", "input", "label", "legend", "li", "main", "mark",
    "nav", "ol", "optgroup", "option", "p", "picture", "pre", "progress",
    "section", "select", "small", "span", "strong", "sub", "summary", "sup",
    "svg", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time",
    "tr", "ul",
}

# cdd-id prefix per Atomic Design level (determined later in classification)
PREFIX_ATOM = "atm"
PREFIX_MOL  = "mol"
PREFIX_ORG  = "org"


# ── Utility ───────────────────────────────────────────────────────────────────

def sha256_short(content: str) -> str:
    """Return first 8 hex chars of SHA-256 hash of content string."""
    return hashlib.sha256(content.encode("utf-8")).hexdigest()[:8]


def file_sha256(path: Path) -> str:
    """Full SHA-256 of a file (for workflow-progress.json file_hashes)."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def classes_from_attr(class_attr: str) -> list[str]:
    return [c for c in (class_attr or "").split() if c]


# ── Atomic Design Classifier ──────────────────────────────────────────────────

ATOM_TAGS = {
    "button", "input", "label", "img", "span", "a", "p",
    "h1", "h2", "h3", "h4", "h5", "h6", "svg", "textarea", "select",
}

# Class fragments that elevate a <div>/<section>/<nav> to a known category
ORGANISM_CLASS_HINTS = {
    "topbar", "hero", "stats-row", "streak-banner", "today-card",
    "form-container", "cta-group", "chart-card", "workout-card",
    "bottom-nav", "nav", "header", "features",
}

MOLECULE_CLASS_HINTS = {
    "field", "stat-card", "workout-vol", "exercise-row", "streak-dot",
    "feature-chip", "checkbox-row", "workout-icon", "btn-social",
    "tag", "workout-info", "workout-tags", "error-banner",
    "progress-bar", "strength-bar", "chart-col", "logo-row",
    "topbar-actions", "user-row", "greeting",
}


def infer_atomic_level(tag: str, classes: list[str]) -> str:
    """Return 'atom', 'molecule', or 'organism' for the element."""
    class_set = set(classes)

    if tag in ATOM_TAGS:
        return "atom"

    if class_set & ORGANISM_CLASS_HINTS:
        return "organism"

    if class_set & MOLECULE_CLASS_HINTS:
        return "molecule"

    # Fallback: structural wrapper tags without a hint → organism
    if tag in {"section", "article", "main", "header", "footer", "nav", "form"}:
        return "organism"

    # Generic div/span without class hints → atom (leaf) or molecule by default
    return "molecule"


def make_rn_component(tag: str, classes: list[str], level: str) -> str:
    """Suggest a React Native component name."""
    mapping = {
        # Atoms
        ("button", "atom"): "TouchableOpacity",
        ("a", "atom"): "TouchableOpacity",
        ("input", "atom"): "TextInput",
        ("label", "atom"): "Text",
        ("span", "atom"): "Text",
        ("p", "atom"): "Text",
        ("h1", "atom"): "Text",
        ("h2", "atom"): "Text",
        ("h3", "atom"): "Text",
        ("h4", "atom"): "Text",
        ("h5", "atom"): "Text",
        ("h6", "atom"): "Text",
        ("img", "atom"): "Image",
        ("svg", "atom"): "Svg",
        ("textarea", "atom"): "TextInput",
        ("select", "atom"): "Picker",
    }

    key = (tag, level)
    if key in mapping:
        return mapping[key]
    return "View"  # default for molecules / organisms / unknown


def make_component_name(tag: str, classes: list[str], level: str) -> str:
    """Derive a PascalCase component name from tag + classes."""
    class_name_map = {
        "btn-primary": "PrimaryButton",
        "btn-secondary": "SecondaryButton",
        "btn-back": "BackButton",
        "btn-social": "SocialButton",
        "field-input": "TextInput",
        "field-label": "FieldLabel",
        "field": "FormField",
        "stat-card": "StatCard",
        "workout-card": "WorkoutHistoryCard",
        "today-card": "TodayWorkoutCard",
        "streak-banner": "StreakBanner",
        "stats-row": "StatsRow",
        "form-container": "AuthForm",
        "cta-group": "CTAGroup",
        "chart-card": "VolumeChart",
        "bottom-nav": "BottomNavBar",
        "topbar": "TopBar",
        "hero": "HeroSection",
        "hero-title": "HeroTitle",
        "hero-desc": "HeroDesc",
        "hero-badge": "HeroBadge",
        "hero-illustration": "HeroIllustration",
        "feature-chip": "FeatureChip",
        "logo-icon": "LogoIcon",
        "logo-text": "LogoText",
        "logo-row": "LogoRow",
        "header": "AppHeader",
        "nav": "NavBar",
        "badge": "Badge",
        "avatar": "Avatar",
        "icon-btn": "IconButton",
        "checkbox": "Checkbox",
        "checkbox-row": "CheckboxField",
        "checkbox-text": "CheckboxLabel",
        "progress-bar": "ProgressBar",
        "progress-fill": "ProgressFill",
        "strength-bar": "StrengthBar",
        "strength-segment": "StrengthSegment",
        "divider": "Divider",
        "divider-line": "DividerLine",
        "divider-text": "DividerText",
        "exercise-row": "ExerciseRow",
        "exercise-num": "ExerciseNumber",
        "exercise-name": "ExerciseName",
        "exercise-detail": "ExerciseDetail",
        "exercise-sets": "ExerciseSets",
        "workout-vol": "VolumeDisplay",
        "workout-name": "WorkoutName",
        "workout-meta": "WorkoutMeta",
        "workout-tags": "WorkoutTags",
        "workout-icon": "WorkoutIcon",
        "tag": "Tag",
        "chart-col": "ChartColumn",
        "chart-bars": "ChartBars",
        "bar": "Bar",
        "bar-label": "BarLabel",
        "streak-banner": "StreakBanner",
        "streak-dots": "StreakDots",
        "streak-dot": "StreakDot",
        "streak-value": "StreakValue",
        "section-title": "SectionTitle",
        "section-link": "SectionLink",
        "section-header": "SectionHeader",
        "today-tag": "TodayTag",
        "fab": "FloatingActionButton",
        "nav-item": "NavItem",
        "nav-icon": "NavIcon",
        "nav-label": "NavLabel",
        "error-banner": "ErrorBanner",
        "show-hide": "PasswordToggle",
        "forgot-link": "ForgotLink",
        "remember-row": "RememberMeRow",
        "remember-label": "RememberLabel",
        "login-hint": "AuthHint",
        "register-hint": "AuthHint",
        "greeting": "Greeting",
        "greeting-sub": "GreetingSubtitle",
        "greeting-name": "GreetingName",
        "user-row": "UserRow",
        "strength-label": "StrengthLabel",
        "password-wrapper": "PasswordField",
        "form-title": "FormTitle",
        "form-subtitle": "FormSubtitle",
        "toggle-btn": "ToggleButton",
        "chart-toggle": "ChartToggle",
        "chart-header": "ChartHeader",
        "today-card-header": "WorkoutCardHeader",
        "today-card-body": "WorkoutCardBody",
        "today-card-footer": "WorkoutCardFooter",
        "today-card-meta": "WorkoutCardMeta",
        "today-card-title": "WorkoutCardTitle",
    }

    for cls in classes:
        if cls in class_name_map:
            return class_name_map[cls]

    # Fallback: PascalCase the tag name
    tag_names = {
        "button": "Button",
        "a": "Link",
        "input": "Input",
        "img": "Image",
        "svg": "Icon",
        "label": "Label",
        "span": "Text",
        "p": "Paragraph",
        "h1": "Heading1",
        "h2": "Heading2",
        "h3": "Heading3",
        "div": "View",
        "section": "Section",
        "nav": "Nav",
        "header": "Header",
        "footer": "Footer",
        "form": "Form",
        "ul": "List",
        "li": "ListItem",
        "select": "Select",
        "textarea": "TextArea",
    }
    return tag_names.get(tag, tag.capitalize())


# ── HTML Parser ───────────────────────────────────────────────────────────────

class ElementNode:
    """Lightweight representation of a visible HTML element."""
    __slots__ = ["tag", "attrs", "inner_text", "depth", "children"]

    def __init__(self, tag: str, attrs: dict, depth: int):
        self.tag = tag
        self.attrs = attrs
        self.inner_text = ""
        self.depth = depth
        self.children: list["ElementNode"] = []

    @property
    def classes(self) -> list[str]:
        return classes_from_attr(self.attrs.get("class", ""))

    def content_signature(self) -> str:
        """Canonical string used for content-hashing (tag + classes + text)."""
        cls_str = " ".join(sorted(self.classes))
        text = re.sub(r"\s+", " ", self.inner_text).strip()[:120]
        return f"{self.tag}|{cls_str}|{text}"


class PrototypeParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root_elements: list[ElementNode] = []
        self._stack: list[ElementNode] = []
        self._depth = 0
        self._skip_depth: int | None = None  # depth where an invisible tag started

    def handle_starttag(self, tag: str, attrs):
        self._depth += 1

        if self._skip_depth is not None:
            return

        if tag in INVISIBLE_TAGS:
            self._skip_depth = self._depth
            return

        if tag not in VISIBLE_TAGS:
            return

        attr_dict = {k: v for k, v in attrs if v is not None}
        node = ElementNode(tag, attr_dict, self._depth)

        if self._stack:
            self._stack[-1].children.append(node)
        else:
            self.root_elements.append(node)

        self._stack.append(node)

    def handle_endtag(self, tag: str):
        if self._skip_depth is not None and self._depth == self._skip_depth:
            self._skip_depth = None
            self._depth -= 1
            return

        self._depth -= 1

        if self._skip_depth is not None:
            return

        if self._stack and self._stack[-1].tag == tag:
            self._stack.pop()

    def handle_data(self, data: str):
        if self._skip_depth is not None:
            return
        text = data.strip()
        if text and self._stack:
            self._stack[-1].inner_text += " " + text


# ── ID Injection ──────────────────────────────────────────────────────────────

def inject_ids_into_html(html_content: str, source_rel: str,
                         counters: dict) -> tuple[str, list[dict]]:
    """
    Parse the HTML, assign cdd-ids, return (modified_html, elements_list).
    Operates on the raw HTML string to preserve formatting.
    """
    parser = PrototypeParser()
    parser.feed(html_content)

    elements = []
    modified_html = html_content

    def traverse(node: ElementNode):
        level = infer_atomic_level(node.tag, node.classes)
        prefix = {"atom": PREFIX_ATOM, "molecule": PREFIX_MOL, "organism": PREFIX_ORG}[level]

        component_name = make_component_name(node.tag, node.classes, level).lower().replace(" ", "-")
        counters.setdefault(prefix, {}).setdefault(component_name, 0)
        counters[prefix][component_name] += 1
        seq = counters[prefix][component_name]
        cdd_id = f"{prefix}-{component_name}-{seq:02d}"

        # Build content hash
        sig = node.content_signature()
        content_hash = sha256_short(sig)

        element = {
            "cdd_id": cdd_id,
            "tag": node.tag,
            "classes": node.classes,
            "text": re.sub(r"\s+", " ", node.inner_text).strip()[:200],
            "attrs": {k: v for k, v in node.attrs.items() if k not in {"class", "id"}},
            "source": source_rel,
            "hash": content_hash,
            "level": level,
            "component_name": make_component_name(node.tag, node.classes, level),
            "rn_component": make_rn_component(node.tag, node.classes, level),
            "is_duplicate": False,
            "is_parameterized": False,
            "canonical_ref": None,
        }
        elements.append(element)

        for child in node.children:
            traverse(child)

    for root in parser.root_elements:
        traverse(root)

    # Inject data-cdd-id attributes into the HTML text
    # We do this by locating opening tags and inserting the attribute
    # Strategy: match elements in document order by tag + class pattern
    for elem in elements:
        tag = elem["tag"]
        class_str = " ".join(elem["classes"]) if elem["classes"] else None
        cdd_id = elem["cdd_id"]

        if class_str:
            pattern = rf'(<{re.escape(tag)}\b[^>]*class=["\'][^"\']*{re.escape(elem["classes"][0])}[^"\']*["\'][^>]*?)(>)'
        else:
            pattern = rf'(<{re.escape(tag)}\b[^>]*?)(>)'

        def replacer(m, cid=cdd_id):
            # Only inject if data-cdd-id not already present
            if 'data-cdd-id' not in m.group(1):
                return m.group(1) + f' data-cdd-id="{cid}"' + m.group(2)
            return m.group(0)

        modified_html, count = re.subn(pattern, replacer, modified_html, count=1, flags=re.IGNORECASE | re.DOTALL)

    return modified_html, elements


# ── Deduplication ─────────────────────────────────────────────────────────────

def deduplicate(elements: list[dict]) -> list[dict]:
    """
    Mark duplicates by content hash. First occurrence = canonical.
    Near-duplicates (same tag + classes, different text) get is_parameterized = True.
    """
    seen_hashes: dict[str, str] = {}         # hash → canonical cdd_id
    seen_signatures: dict[str, str] = {}      # tag|classes → canonical cdd_id

    for elem in elements:
        h = elem["hash"]
        structural_key = f"{elem['tag']}|{'|'.join(sorted(elem['classes']))}"

        if h in seen_hashes:
            elem["is_duplicate"] = True
            elem["canonical_ref"] = seen_hashes[h]
        elif structural_key in seen_signatures:
            # Same structure, different text → parameterized component
            elem["is_parameterized"] = True
            elem["canonical_ref"] = seen_signatures[structural_key]
        else:
            seen_hashes[h] = elem["cdd_id"]
            if structural_key not in seen_signatures:
                seen_signatures[structural_key] = elem["cdd_id"]

    return elements


# ── Main Pipeline ─────────────────────────────────────────────────────────────

def collect_html_files(input_path: Path) -> list[Path]:
    if input_path.is_file():
        return [input_path]
    files = []
    for root, _, filenames in os.walk(input_path):
        for fname in sorted(filenames):
            if fname.endswith(".html"):
                files.append(Path(root) / fname)
    return sorted(files)


def run(input_path: Path, output_path: Path, annotated_dir: Path | None = None):
    html_files = collect_html_files(input_path)
    if not html_files:
        print(f"[ERROR] No HTML files found in: {input_path}", file=sys.stderr)
        sys.exit(1)

    print(f"[INFO] Found {len(html_files)} HTML file(s)")

    all_elements: list[dict] = []
    file_hashes: dict[str, str] = {}
    counters: dict = {}

    for html_file in html_files:
        rel = str(html_file.relative_to(input_path)).replace("\\", "/")
        print(f"[INFO] Processing: {rel}")

        raw = html_file.read_text(encoding="utf-8")
        file_hashes[rel] = file_sha256(html_file)

        modified_html, elements = inject_ids_into_html(raw, rel, counters)

        # Write annotated HTML if output dir specified
        if annotated_dir:
            out_file = annotated_dir / rel
            out_file.parent.mkdir(parents=True, exist_ok=True)
            out_file.write_text(modified_html, encoding="utf-8")
            print(f"[INFO]   -> annotated HTML written: {out_file}")

        all_elements.extend(elements)

    # Deduplicate across all files
    all_elements = deduplicate(all_elements)

    canonical = [e for e in all_elements if not e["is_duplicate"]]
    duplicates = [e for e in all_elements if e["is_duplicate"]]
    parameterized = [e for e in all_elements if e["is_parameterized"] and not e["is_duplicate"]]

    result = {
        "meta": {
            "input": str(input_path),
            "files_processed": len(html_files),
            "total_elements": len(all_elements),
            "canonical_elements": len(canonical),
            "duplicate_elements": len(duplicates),
            "parameterized_elements": len(parameterized),
            "file_hashes": file_hashes,
        },
        "elements": all_elements,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[OK] Output written -> {output_path}")
    print(f"     Total: {len(all_elements)} | Canonical: {len(canonical)} | Duplicates: {len(duplicates)} | Parameterized: {len(parameterized)}")

    return result


def main():
    parser = argparse.ArgumentParser(
        description="CDD Pre-Processing: inject cdd-ids, deduplicate, emit JSON"
    )
    parser.add_argument("--input",   required=True, help="HTML file or directory of HTML files")
    parser.add_argument("--output",  required=True, help="Path for the output JSON file")
    parser.add_argument("--annotate-dir", default=None,
                        help="Directory to write annotated HTML files with injected data-cdd-id attributes")
    args = parser.parse_args()

    input_path  = Path(args.input).resolve()
    output_path = Path(args.output).resolve()
    annotated   = Path(args.annotate_dir).resolve() if args.annotate_dir else None

    if not input_path.exists():
        print(f"[ERROR] Input path does not exist: {input_path}", file=sys.stderr)
        sys.exit(1)

    run(input_path, output_path, annotated)


if __name__ == "__main__":
    main()
