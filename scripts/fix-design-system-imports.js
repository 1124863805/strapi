#!/usr/bin/env node
/**
 * Fix design-system imports: components -> @leao1/design-system, icons -> @leao1/design-system/icons
 * Handles both single-line and multi-line imports.
 */
const fs = require('fs');
const path = require('path');

const COMPONENTS = new Set([
  'Accordion', 'Alert', 'AlertVariant', 'Avatar', 'Badge', 'BaseLink', 'Box', 'BoxComponent',
  'Breadcrumbs', 'Button', 'ButtonProps',   'Card', 'CardAction', 'CardAsset', 'CardBadge', 'CardBody', 'CardCheckbox', 'CardContent',
  'CardHeader', 'CardSubtitle', 'CardTimer', 'CardTitle',
  'CarouselInput', 'CarouselActions', 'CarouselSlide', 'Checkbox', 'Combobox', 'ComboboxOption',
  'Crumb', 'CrumbLink', 'CrumbSimpleMenu', 'DatePicker', 'DateTimePicker', 'Dialog', 'Divider', 'EmptyStateLayout',
  'EmptyStateLayoutProps', 'Field', 'Flex', 'FlexComponent', 'FlexProps', 'FocusTrap',
  'Grid', 'IconButton', 'IconButtonGroup', 'IconButtonProps', 'inputFocusStyle', 'JSONInput',
  'KeyboardNavigable', 'Link', 'LinkButton', 'LinkProps', 'LiveRegions', 'Loader', 'Main', 'MainProps',
  'Menu', 'MenuItem', 'Modal', 'MultiSelect', 'MultiSelectNested', 'MultiSelectNestedProps', 'MultiSelectOption', 'NumberInput', 'Pagination',
  'Popover', 'Portal', 'ProgressBar', 'Radio', 'RawTable', 'RawTbody', 'RawTd', 'RawTdProps', 'RawTh', 'RawThead', 'RawTr', 'RawTrProps',
  'Searchbar', 'SearchForm', 'Select', 'SimpleMenu', 'SingleSelect', 'SingleSelectOption',
  'SingleSelectProps', 'Status', 'SubNav', 'SubNavHeader', 'SubNavLink', 'SubNavLinkSection',
  'SubNavSection', 'SubNavSections', 'Switch', 'Tab', 'TabPanel', 'Table', 'TableProps',
  'Tabs', 'Tag', 'Tbody', 'Td', 'TFooter', 'TextButton', 'Textarea', 'TextareaProps', 'TextInput',
  'TextInputProps', 'Thead', 'Th', 'TimePicker', 'Toggle', 'Tooltip', 'Tr',
  'Typography', 'TypographyComponent', 'TypographyProps', 'VisuallyHidden',
  'extendTheme', 'lightTheme', 'LeaoTheme', 'useCallbackRef', 'useComposedRefs',
  'BoxProps', 'CarouselInputProps', 'CheckboxProps', 'ComboboxProps', 'AccessibleIcon', 'BadgeProps', 'TooltipProps',
  'JSONInputRef',
  'useCollator', 'useFilter', 'useNotifyAT', 'SkipToContent', 'DismissibleLayer',
]);

function parseNames(str) {
  return str.split(',')
    .map(s => s.trim().split(/\s+as\s+/)[0].trim())
    .filter(Boolean);
}

function splitNames(names) {
  const components = [];
  const icons = [];
  for (const n of names) {
    if (COMPONENTS.has(n)) components.push(n);
    else icons.push(n);
  }
  return { components, icons };
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const importRegex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]@leao1\/design-system\/icons['"];?/g;
  let changed = false;

  content = content.replace(importRegex, (match, namesStr) => {
    const names = parseNames(namesStr);
    const { components, icons } = splitNames(names);
    if (components.length === 0) return match; // icon-only, keep as is

    changed = true;
    const result = [];
    if (components.length > 0) {
      result.push(`import { ${components.join(', ')} } from '@leao1/design-system';`);
    }
    if (icons.length > 0) {
      result.push(`import { ${icons.join(', ')} } from '@leao1/design-system/icons';`);
    }
    return result.join('\n');
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', filePath);
  }
}

const packagesDir = path.join(__dirname, '../packages');
const excludeDirs = ['dist', 'node_modules', '.cache'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !excludeDirs.includes(e.name)) {
      walk(full);
    } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) {
      if (fs.readFileSync(full, 'utf8').includes("from '@leao1/design-system/icons'")) {
        fixFile(full);
      }
    }
  }
}

walk(packagesDir);

// Fix vendor/design-system extendTheme
const extendThemePath = path.join(packagesDir, 'vendor/design-system/src/themes/extendTheme.ts');
if (fs.existsSync(extendThemePath)) {
  let c = fs.readFileSync(extendThemePath, 'utf8');
  if (c.includes("from '@leao1/design-system/icons'")) {
    c = c.replace(/from\s*['"]@leao1\/design-system\/icons['"]/, "from '@leao1/design-system'");
    fs.writeFileSync(extendThemePath, c);
    console.log('Fixed:', extendThemePath);
  }
}

// Fix custom.d.ts - LeaoTheme
for (const p of [
  'core/admin/admin/custom.d.ts',
  'core/content-manager/admin/custom.d.ts',
  'core/review-workflows/admin/custom.d.ts',
  'core/admin/ee/admin/custom.d.ts',
]) {
  const full = path.join(packagesDir, p);
  if (fs.existsSync(full)) {
    let c = fs.readFileSync(full, 'utf8');
    if (c.includes("from '@leao1/design-system/icons'")) {
      c = c.replace(/from\s*['"]@leao1\/design-system\/icons['"]/, "from '@leao1/design-system'");
      fs.writeFileSync(full, c);
      console.log('Fixed:', full);
    }
  }
}

console.log('Done.');
