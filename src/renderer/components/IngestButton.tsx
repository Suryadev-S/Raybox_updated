import React, { useState } from "react";
import { Button } from "./ui/button";
import { useBinNavigation } from "./BinNavigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";

type DuplicateDialogProps = {
    open: boolean

    fileName?: string

    onKeep: () => void

    onDiscard: () => void
}

function DuplicateDialog({
    open,
    fileName,
    onKeep,
    onDiscard,
}: DuplicateDialogProps) {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Duplicate File Found
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        The file
                        {" "}
                        <strong>{fileName}</strong>
                        {" "}
                        already exists.

                        <br />
                        <br />

                        Do you want to keep it as a duplicate
                        reference or discard it?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={onDiscard}
                    >
                        Discard
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={onKeep}
                    >
                        Keep
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


const IngestButton = () => {
    const [loading, setLoading] = useState(false);
    const [duplicateOpen, setDuplicateOpen] = useState(false);
    const [pendingDuplicate, setPendingDuplicate] = useState<{
        filePath: string
        duplicateName?: string
    } | null>(null)
    const { navStack } = useBinNavigation();

    async function handleKeepDuplicate() {
        if (!pendingDuplicate) {
            return
        }

        const ingestResult =
            await window.file.ingest_v2({
                filePath:
                    pendingDuplicate.filePath,

                bin:
                    navStack[
                    navStack.length - 1
                    ],

                options: {
                    duplicateStrategy:
                        "keep",
                },
            })

        setDuplicateOpen(false)
        setPendingDuplicate(null)

        if (!ingestResult.success) {
            alert("Ingestion failed")
            return
        }

        alert(
            "Duplicate reference created"
        )
    }

    async function handleDiscardDuplicate() {
        if (!pendingDuplicate) {
            return
        }

        await window.file.ingest_v2({
            filePath:
                pendingDuplicate.filePath,

            bin:
                navStack[
                navStack.length - 1
                ],

            options: {
                duplicateStrategy:
                    "discard",
            },
        })

        setDuplicateOpen(false)
        setPendingDuplicate(null)

        alert(
            "Duplicate discarded"
        )
    }

    async function handleIngest() {
        try {
            setLoading(true)

            // Open native file picker
            const result = await window.file.pick()

            if (!result || result.canceled) {
                return
            }

            // Entire ingestion handled by backend
            // const ingestResult = await window.file.ingest(
            //     result.path,
            //     navStack[navStack.length - 1]
            // )

            const ingestResult = await window.file.ingest_v2({
                filePath: result.path,
                bin: navStack[navStack.length - 1]
            })

            console.log(ingestResult)

            if (
                ingestResult.reason ===
                "DUPLICATE_FOUND"
            ) {
                setPendingDuplicate({
                    filePath: result.path,
                    duplicateName:
                        ingestResult.duplicateFile?.name,
                })

                setDuplicateOpen(true)

                return
            }

            if (!ingestResult.success) {
                // alert("Ingestion failed")
                switch (
                ingestResult.reason
                ) {

                    case "STORE_NOT_FOUND":
                        alert(
                            "No media store configured."
                        )
                        break

                    case "UNSUPPORTED_FILE_TYPE":
                        alert(
                            "Unsupported file type."
                        )
                        break

                    case "DUPLICATE_DISCARDED":
                        alert(
                            "Duplicate file discarded."
                        )
                        break

                    case "INGESTION_FAILED":
                        alert(
                            "Ingestion failed."
                        )
                        break

                    default:
                        alert(
                            "Unknown error."
                        )
                }
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
        <>
            <Button
                onClick={handleIngest}
                disabled={loading}
            >
                {loading ? "Processing..." : "Add Media"}
            </Button>
            <DuplicateDialog
                open={duplicateOpen}
                fileName={
                    pendingDuplicate?.duplicateName
                }
                onKeep={handleKeepDuplicate}
                onDiscard={
                    handleDiscardDuplicate
                }
            />
        </>
    )
}

export default IngestButton