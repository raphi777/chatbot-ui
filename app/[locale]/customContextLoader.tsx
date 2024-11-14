import { useContext, useEffect } from "react"
import { ChatbotUIContext } from "@/context/context"
import fetchCustomContextFiles from "@/db/context-files"

const CustomContextLoader = () => {
  const { customContextFiles, setCustomContextFiles } =
    useContext(ChatbotUIContext)

  useEffect(() => {
    const loadContextData = async () => {
      try {
        const files = await fetchCustomContextFiles()

        if (files) {
          setCustomContextFiles(files)
        } else {
          console.warn("No custom cuntext files found or error occurred.")
        }
      } catch (error) {
        console.error("Error loading and setting custom context:", error)
      }
    }

    loadContextData()
  }, [])

  useEffect(() => {
    if (customContextFiles.length > 0) {
      console.log("Custom context updated:", customContextFiles)
    }
  }, [customContextFiles])

  return null
}

export default CustomContextLoader
