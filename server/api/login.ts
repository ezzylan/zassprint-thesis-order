export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, loginSchema.parse);

  const { adminEmail, adminPassword } = useRuntimeConfig();

  if (email === adminEmail && password === adminPassword) {
    await setUserSession(event, {
      user: {
        name: "Zass Admin",
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
