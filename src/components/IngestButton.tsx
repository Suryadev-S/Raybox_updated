import React, { useState } from "react";
import { Button } from "./ui/button";
import { useBinNavigation } from "./BinNavigation";

const IngestButton = () => {
    const [loading, setLoading] = useState(false);
    const { navStack } = useBinNavigation();

    async function handleIngest() {
        try {
            setLoading(true)

            // Open native file picker
            const result = await window.file.pick()

            if (!result || result.canceled) {
                return
            }

            // Entire ingestion handled by backend
            const ingestResult = await window.file.ingest(
                result.path,
                navStack[navStack.length - 1]
            )

            console.log(ingestResult)

            if (!ingestResult.success) {
                alert("Ingestion failed")
                return
            }

            alert("Ingestion completed")
        } catch (error) {
            console.error(error)
            alert("Pipeline failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleIngest}
            disabled={loading}
        >
            {loading ? "Processing..." : "Add Media"}
        </Button>
    )
}

export default IngestButton