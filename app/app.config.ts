export default defineAppConfig({
  ui: {
    colors: {
      primary: "red",
    },
    container: {
      base: "py-4",
    },
    button: {
      slots: { base: "cursor-pointer" },
    },
    input: {
      slots: { root: "inline" },
    },
    inputNumber: {
      slots: { root: "w-full" },
    },
    textarea: {
      slots: { root: "inline" },
    },
    select: {
      slots: { base: "w-full" },
    },
  },
});
