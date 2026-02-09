// ═══════════════════════════════════════════════════════════════════════════
// PitKit - Design System
// ═══════════════════════════════════════════════════════════════════════════
//
// Atomic Design Structure:
// - atoms/     → Smallest building blocks (Input, Button, Label, Badge, etc.)
// - molecules/ → Combinations of atoms (Field, TextField, SelectField)
// - organisms/ → Complex components (Card, Table, Modal)
//
// ═══════════════════════════════════════════════════════════════════════════

// ─── Atoms ───────────────────────────────────────────────────────────────────
export * from './atoms';

// ─── Molecules ───────────────────────────────────────────────────────────────
export * from './molecules';

// ─── Organisms ───────────────────────────────────────────────────────────────
export * from './organisms';

// ═══════════════════════════════════════════════════════════════════════════
// Backward Compatibility Aliases
// ═══════════════════════════════════════════════════════════════════════════
// The old Input and Select components had label/error/helperText built-in.
// They are now TextField and SelectField respectively.
//
// Migration:
//   <Input label="Name" error="Required" />
//   → <TextField label="Name" error="Required" />
//
//   <Select label="Role" options={...} error="Required" />
//   → <SelectField label="Role" options={...} error="Required" />
//
// Or use the atomic approach:
//   <Field label="Name" error="Required">
//     <Input />
//   </Field>
// ═══════════════════════════════════════════════════════════════════════════

// Legacy aliases - use TextField and SelectField instead
export { TextField as Input } from './molecules/TextField';
export { SelectField as Select } from './molecules/SelectField';
