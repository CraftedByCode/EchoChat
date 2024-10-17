import { authLoginSchema, authRegisterSchema } from "../schemas/authSchema";
import type { formData, validateResult } from "../types";

const validateForm = async (form: formData): Promise<validateResult> => {
  const result = !form.username
    ? await authLoginSchema.safeParseAsync(form)
    : await authRegisterSchema.safeParseAsync(form);

  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: String(err.path[0]),
      message: err.message,
    }));
    console.log(result.error);
    return { success: false, errors: formattedErrors };
  }
  return { success: true, data: result.data };
};

export default validateForm;
