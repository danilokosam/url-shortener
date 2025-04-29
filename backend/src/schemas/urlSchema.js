import { z } from "zod";

const shortenUrlSchema = z.object({
  body: z.object({
    originalUrl: z
      .string({ required_error: "originalUrl is required" })
      .url({ message: "Invalid URL format" })
      .refine(
        (url) => {
          try {
            const parsedUrl = new URL(url);
            return ["http:", "https:"].includes(parsedUrl.protocol);
          } catch {
            return false;
          }
        },
        { message: "URL must use http or https protocol" }
      ),
  }),
  params: z.object({}),
  query: z.object({}),
});

export { shortenUrlSchema };
