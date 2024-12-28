import { loginSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    loginSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  return result;
});
