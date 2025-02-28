import { loginSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, (body) =>
    loginSchema.parse(body),
  );

  const { adminEmail, adminPassword } = useRuntimeConfig();

  if (email === adminEmail && password === adminPassword) {
    await setUserSession(event, {
      user: {
        name: "Super Admin",
        email: adminEmail,
      },
    });
    return {};
  }

  throw createError({
    statusCode: 401,
    message: "Bad credentials",
  });
});
