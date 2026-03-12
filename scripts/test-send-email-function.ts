import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing required env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before running this script."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const functionName = "send-email";
const payload = { name: "Functions", email: "reliutg@gmail.com" };

async function debugWithDirectFetch() {
  const url = `${supabaseUrl}/functions/v1/${functionName}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(payload),
  });

  const rawBody = await res.text();
  console.error("Direct fetch debug");
  console.error("Status:", res.status, res.statusText);
  console.error("Body:", rawBody);
}

async function main() {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
  });

  if (error) {
    console.error("Function invocation failed:");
    console.error(error);
    await debugWithDirectFetch();
    process.exit(1);
  }

  console.log("Function response:");
  console.log(data);
}

main().catch((error) => {
  console.error("Unexpected error running script:");
  console.error(error);
  process.exit(1);
});
