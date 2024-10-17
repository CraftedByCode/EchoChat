import z from "zod";
import dns from "dns";

const resolveMXPromise = (domain: string): Promise<dns.MxRecord[]> => {
  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        reject(err);
      } else if (!addresses || addresses.length === 0) {
        reject(new Error("No MX Records Found"));
      } else {
        resolve(addresses);
      }
    });
  });
};

const authRegisterSchema = z.object({
  username: z
    .string()
    .min(7, "username is too small")
    .max(15, "username is too long"),

  email: z
    .string()
    .email()
    .superRefine(async (email, ctx) => {
      const domain = email.split("@")[1];
      try {
        await resolveMXPromise(domain);
      } catch (error) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "domain is not recognized!",
        });
      }
    }),
  password: z
    .string()
    .min(6, "password is too small")
    .max(16, "password is too big"),
});

const authLoginSchema = authRegisterSchema.omit({ username: true });

export { authRegisterSchema, authLoginSchema };
