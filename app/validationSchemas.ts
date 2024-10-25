import { z } from "zod";

const createIssueSchema = z.object({
  title: z.string().min(1, "title is required.").max(255),
  description: z.string().min(1, "title is required."),
});

export { createIssueSchema };
