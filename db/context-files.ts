import { supabase } from "@/lib/supabase/browser-client"

export default async function fetchCustomContextFiles() {
  try {
    const { data, error } = await supabase.from("files_custom").select("*")

    console.log("FETCH SUPABASE", data, error)

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }
    return data
  } catch (error) {
    console.error("Error loading custom context files:", error)
    return []
  }
}
