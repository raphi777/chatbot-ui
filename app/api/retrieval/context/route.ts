import { generateLocalEmbedding } from "@/lib/generate-local-embedding"
import { createClient } from "@supabase/supabase-js"
import { Database } from "@/supabase/types"

export async function POST(request: Request) {
  const json = await request.json()
  const { userInput, fileIds, sourceCount } = json as {
    userInput: string
    fileIds: string[]
    sourceCount: number
  }

  const uniqueFileIds = [...new Set(fileIds)]

  try {
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let chunks: any[] = []

    const localEmbedding = await generateLocalEmbedding(userInput)

    console.log("loacalEmbedding", localEmbedding.length)

    const { data: localFileItems, error: localFileItemsError } =
      await supabaseAdmin.rpc("match_file_items_custom_local", {
        query_embedding: localEmbedding as any,
        match_count: sourceCount,
        file_ids: uniqueFileIds
      })

    if (localFileItemsError) {
      throw localFileItemsError
    }

    chunks = localFileItems
    console.log("CHUNKS", chunks)

    const mostSimilarChunks = chunks?.sort(
      (a, b) => b.similarity - a.similarity
    )

    return new Response(JSON.stringify({ results: mostSimilarChunks }), {
      status: 200
    })
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
