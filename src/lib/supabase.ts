import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase credentials are required for storage operations.");
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
}

export const storageBuckets = {
  campaignAssets: "campaign-assets",
  contracts: "vendor-contracts",
  invoices: "invoices",
  reports: "reports",
} as const;
