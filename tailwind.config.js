/** @type {import('tailwindcss').Config} */
const defaultTheme = {
  container: {
    center: true,
    padding: "2rem",
  },
  extend: {
    // Шкалы neutral/accent/accent-secondary удалены вместе с палитрами
    // @radix-ui/colors: классы вида bg-accent-9 в проекте не использовались,
    // а объект `accent` перекрывал скалярный --color-accent из index.css,
    // на котором держится hover у ghost/outline-кнопок shadcn.
    colors: {
      fg: {
        DEFAULT: "var(--color-fg)",
        secondary: "var(--color-fg-secondary)",
      },
      bg: {
        DEFAULT: "var(--color-bg)",
        inset: "var(--color-bg-inset)",
        overlay: "var(--color-bg-overlay)",
      },
      "focus-ring": "var(--color-focus-ring)",
    },
    borderRadius: {
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      "2xl": "var(--radius-2xl)",
      full: "var(--radius-full)",
    },
  },
  spacing: {
    px: "var(--size-px)",
    0: "var(--size-0)",
    0.5: "var(--size-0-5)",
    1: "var(--size-1)",
    1.5: "var(--size-1-5)",
    2: "var(--size-2)",
    2.5: "var(--size-2-5)",
    3: "var(--size-3)",
    3.5: "var(--size-3-5)",
    4: "var(--size-4)",
    5: "var(--size-5)",
    6: "var(--size-6)",
    7: "var(--size-7)",
    8: "var(--size-8)",
    9: "var(--size-9)",
    10: "var(--size-10)",
    11: "var(--size-11)",
    12: "var(--size-12)",
    14: "var(--size-14)",
    16: "var(--size-16)",
    20: "var(--size-20)",
    24: "var(--size-24)",
    28: "var(--size-28)",
    32: "var(--size-32)",
    36: "var(--size-36)",
    40: "var(--size-40)",
    44: "var(--size-44)",
    48: "var(--size-48)",
    52: "var(--size-52)",
    56: "var(--size-56)",
    60: "var(--size-60)",
    64: "var(--size-64)",
    72: "var(--size-72)",
    80: "var(--size-80)",
    96: "var(--size-96)",
  },
  darkMode: ["selector", '[data-appearance="dark"]'],
}

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: defaultTheme,
};