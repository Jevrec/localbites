import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  apiVersion: "2023-11-01",
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});
