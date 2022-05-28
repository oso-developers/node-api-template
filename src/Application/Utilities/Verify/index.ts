import { ZodObject, ZodIssue } from "zod"

/**
 *  helper function which makes it easier to check if a zod schema is valid
 * 
*/
function Verify(data: any, schema: ZodObject<any>): ZodIssue[] | undefined {
  const result = schema.safeParse(data)
  if (!result.success) {
    return result.error.issues
  }
}

export default Verify