# Add Translation Key

Add a new i18n key to all four language objects.

## Steps

1. Open `src/i18n/translations.ts`
2. Add the key to **all four** language objects: `nl`, `en`, `fr`, `de`
3. Keep keys in alphabetical order within each object
4. The `satisfies Record<Language, Record<string, string>>` constraint will
   cause a TS error if any language is missing the key — use that as your
   verification

## Key naming convention

- `btn_` prefix → buttons (`btn_buy`, `btn_save`)
- `lbl_` prefix → labels (`lbl_vessel_name`)
- `msg_` prefix → messages/descriptions (`msg_payment_success`)
- `err_` prefix → errors (`err_code_invalid`)
- `ttl_` prefix → section titles (`ttl_contacts`)

## Never translate

- VHF channel numbers
- Internationally standardised signal descriptions (MAYDAY, PAN PAN, etc.)
- The brand name "MareSafe"

## Usage in components

```tsx
// In component — dynamic
const { t } = useTranslation()
<span>{t('lbl_vessel_name')}</span>

// Static HTML — data attribute
<label data-i18n="lbl_vessel_name" />
```

After adding the key, search for any hardcoded English strings in the same area
you're working and replace them too.
