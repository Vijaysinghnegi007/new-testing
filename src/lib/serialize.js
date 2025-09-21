// Utilities to ensure props passed from server components to client components are JSON-serializable.
// Keep this lightweight and framework-agnostic.

const isPlainObject = (val) => Object.prototype.toString.call(val) === '[object Object]';

/**
 * Convert a value into a JSON-serializable structure.
 * - Date -> ISO string
 * - Array -> recursively serialized
 * - Plain Object -> recursively serialized
 * - number/string/boolean/null -> as-is
 * - undefined inside objects will be dropped by JSON (React props treat missing and undefined similarly)
 * - Map/Set/Function/Symbol/BigInt/Class instances -> throws by default
 */
export function toSerializable(input, options = {}) {
  const {
    onNonSerializable = 'throw', // 'throw' | 'omit'
    maxDepth = 100,
  } = options;

  const seen = new WeakSet();

  const helper = (value, depth) => {
    if (depth > maxDepth) {
      throw new Error('toSerializable: Max depth exceeded');
    }

    if (value == null) return value; // null or undefined

    const t = typeof value;
    if (t === 'string' || t === 'number' || t === 'boolean') return value;

    if (value instanceof Date) return value.toISOString();

    if (Array.isArray(value)) {
      if (seen.has(value)) throw new Error('toSerializable: Circular reference in Array');
      seen.add(value);
      return value.map((v) => helper(v, depth + 1));
    }

    if (isPlainObject(value)) {
      if (seen.has(value)) throw new Error('toSerializable: Circular reference in Object');
      seen.add(value);
      const out = {};
      for (const [k, v] of Object.entries(value)) {
        const serialized = helper(v, depth + 1);
        if (serialized !== undefined) out[k] = serialized; // drop undefined keys
      }
      return out;
    }

    // Non-serializable types
    if (value instanceof Map || value instanceof Set || typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') {
      if (onNonSerializable === 'omit') return undefined;
      throw new Error(`toSerializable: Unsupported type for key: ${String(value)}`);
    }

    // Class instances or other complex objects
    if (value && value.constructor && value.constructor !== Object) {
      if (onNonSerializable === 'omit') return undefined;
      throw new Error(`toSerializable: Class instances are not supported: ${value.constructor?.name || 'Unknown'}`);
    }

    return value;
  };

  return helper(input, 0);
}

/**
 * Optional revive helper if you need to parse ISO strings back into Dates in the client.
 * This intentionally does not auto-revive by default to avoid unexpected behavior.
 */
export function reviveDates(input, predicate = (key) => /(?:At|Date)$/.test(key)) {
  const seen = new WeakSet();

  const helper = (value, keyPath = []) => {
    if (value == null) return value;
    if (typeof value === 'string') {
      // Only revive when key matches a heuristic (e.g., ends with At/Date) and value looks like ISO
      const key = keyPath[keyPath.length - 1] || '';
      if (predicate(key) && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
        const d = new Date(value);
        if (!isNaN(d.getTime())) return d;
      }
      return value;
    }
    if (Array.isArray(value)) {
      if (seen.has(value)) throw new Error('reviveDates: Circular reference in Array');
      seen.add(value);
      return value.map((v, i) => helper(v, keyPath.concat(String(i))));
    }
    if (isPlainObject(value)) {
      if (seen.has(value)) throw new Error('reviveDates: Circular reference in Object');
      seen.add(value);
      const out = {};
      for (const [k, v] of Object.entries(value)) {
        out[k] = helper(v, keyPath.concat(k));
      }
      return out;
    }
    return value;
  };

  return helper(input, []);
}

