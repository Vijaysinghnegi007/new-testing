import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  // Disallow next/dynamic in non-client files to avoid RSC errors
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ["next/dynamic"],
              message:
                "Use next/dynamic only inside client components. Create a *.client.* wrapper and import that from server components.",
            },
          ],
        },
      ],
    },
  },
  // Allow next/dynamic inside dedicated client wrappers
  {
    files: ["**/*.client.{js,jsx,ts,tsx}"],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];

export default eslintConfig;
