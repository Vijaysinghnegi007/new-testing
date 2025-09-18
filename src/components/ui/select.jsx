'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Minimal, accessible Select implementation compatible with the existing API shape
// Usage example (already in codebase):
// <Select value={val} onValueChange={setVal}>
//   <SelectTrigger><SelectValue /></SelectTrigger>
//   <SelectContent>
//     <SelectItem value="a">A</SelectItem>
//     <SelectItem value="b">B</SelectItem>
//   </SelectContent>
// </Select>

const SelectContent = ({ children }) => {
  // Render nothing; used only for declaring items
  return null;
};
SelectContent.displayName = 'SelectContent';

const SelectItem = ({ value, children }) => {
  // Render nothing; items are extracted by parent Select
  return null;
};
SelectItem.displayName = 'SelectItem';

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  // Hidden placeholder for compatibility with existing markup
  return (
    <div ref={ref} className={cn('hidden', className)} {...props}>
      {children}
    </div>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder }) => {
  // Placeholder component; actual value is rendered by native select
  return null;
};
SelectValue.displayName = 'SelectValue';

function extractItems(children) {
  const items = [];
  React.Children.forEach(children, (child) => {
    if (!child) return;
    if (child.type === SelectContent) {
      React.Children.forEach(child.props.children, (item) => {
        if (!item) return;
        if (item.type === SelectItem) {
          items.push({ value: item.props.value, label: item.props.children });
        }
      });
    }
  });
  return items;
}

const Select = ({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  disabled,
  ...props
}) => {
  const items = React.useMemo(() => extractItems(children), [children]);
  const initial =
    value ?? defaultValue ?? (items.length > 0 ? items[0].value : '');
  const [internalValue, setInternalValue] = React.useState(initial);

  React.useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setInternalValue(v);
    onValueChange?.(v);
  };

  return (
    <div className="relative">
      <select
        className={cn(
          'h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-8 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          className
        )}
        value={internalValue}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      >
        {items.map((it) => (
          <option key={String(it.value)} value={it.value}>
            {typeof it.label === 'string' ? it.label : String(it.value)}
          </option>
        ))}
      </select>
      {/* Chevron indicator */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};
Select.displayName = 'Select';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
