# Stage 0 Todo Card

This project is a single-page Todo Card built with plain HTML, CSS, and JavaScript.

## What Changed From Stage 0

1. Added editable task fields:

- Title
- Description
- Priority
- Due date
- Status

2. Added edit workflow:

- Edit button switches display mode to form controls
- Save persists updates to the card UI
- Cancel restores the previous snapshot

3. Added description collapse/expand behavior:

- Long descriptions are truncated with ellipsis in collapsed mode
- Toggle button expands to full text and collapses back
- Edit mode shows full description text in the textarea

4. Added task completion behavior:

- Checkbox marks task as complete
- Completed state applies strikethrough to the title
- Completed state updates status to Done

5. Added due date and remaining time logic:

- Parses due date values
- Shows human-readable remaining time
- Displays overdue indicator when time is zero or below

## New Design Decisions

1. Keep the app framework-free:

- Vanilla JavaScript was used to keep logic explicit and lightweight for Stage 0.

2. Use DOM-first state with small cached values:

- The UI is treated as the source of truth for most fields.
- `snapshot` is used for cancel behavior.
- `fullDescriptionText` is used to avoid losing full content during truncate/collapse.

3. Separate display mode from edit mode:

- `toggleEditMode` centralizes visibility switching for text and form controls.

4. Separate date/time updates from completion updates:

- `updateTaskDates` handles due date and overdue state.
- `updateCompletionState` handles done/pending state and visual completion rules.

5. Preserve testability:

- Existing `data-testid` attributes are maintained for key elements and controls.

## Known Limitations

1. No persistent storage:

- Data resets on page reload.

2. Single-item scope:

- Current implementation supports one task card only.

3. Description truncation state is not fully modeled:

- Expand/collapse is local UI behavior and not persisted.

4. No form validation feedback UI:

- Invalid or empty values are not yet surfaced with inline validation messages.

5. Date behavior is local-time dependent:

- Remaining time calculations rely on browser local time.

6. Delete action is placeholder:

- Delete button currently triggers a simple alert only.

## Accessibility Notes

1. Semantic structure:

- Uses semantic elements such as `time`, labels, and button controls.

2. ARIA attributes:

- Includes `aria-label`, `aria-live="polite"`, and `aria-expanded` on relevant controls.

3. Keyboard accessibility:

- Core controls are native HTML elements (`button`, `input`, `select`, `textarea`) and keyboard-focusable by default.

4. Visible status communication:

- Completion, overdue, and priority states are represented in text, not color alone.

5. Areas to improve:

- Add stronger focus styles for all interactive controls.
- Ensure icon-only toggle always has synchronized, dynamic screen reader labels.
- Improve form validation messaging and announcements for assistive tech.
