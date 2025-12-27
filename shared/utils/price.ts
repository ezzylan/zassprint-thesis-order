export const getPrice = async (name: string) => {
  const prices =
    await $fetch<{ name: string; amount: number }[]>("/api/prices");

  return prices.find((price) => price.name === name)?.amount;
};
