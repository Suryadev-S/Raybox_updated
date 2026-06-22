import { useBinNavigation } from '@renderer/components/BinNavigation'
import CreateBin from '@renderer/components/CreateBin'
import IngestButton from '@renderer/components/IngestButton'
import RenameItemButton from '@renderer/components/RenameItem'
import { Button } from '@renderer/components/ui/button'
import { Checkbox } from '@renderer/components/ui/checkbox'
import { BinRecordData, FileRecordData, SelectedItem } from '@shared/types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Media() {
    const { navStack, setNavStack } = useBinNavigation();

    const [bins, setBins] = useState<BinRecordData[]>([]);
    const [files, setFiles] = useState<FileRecordData[]>([]);
    const [selection, setSelection] = useState<SelectedItem | null>(null)

    console.log(navStack);

    useEffect(() => {
        loadBin(navStack[navStack.length - 1].id)
    }, [navStack.length])

    async function loadBin(binId: string | null) {
        const data =
            await window.store.getBin(
                binId
            )
        setBins(data.bins)
        setFiles(data.files)
    }

    async function handleDelete() {
        if (!selection) return

        if (selection.itemType === 'bin') {
            await window.store.deleteBin(
                selection.data.id,
                `${selection.data.ancestor_path}/${selection.data.name}`.replace(/\/+/g, "/")
            )
        } else {
            await window.store.deleteFile(
                selection.data.id
            )
        }

        setSelection(null)

        await loadBin(
            navStack[navStack.length - 1].id
        )
    }

    return (
        <div className="p-4">

            <h1 className="mb-4 text-lg font-bold">
                Explorer with bin
                <br /><br />
                <CreateBin />
                <br /><br />
                <IngestButton />
                <br /><br />
                <Button
                    variant="destructive"
                    disabled={!selection}
                    onClick={handleDelete}
                >
                    Delete
                </Button>
                <br />
                <br />
                <RenameItemButton
                    selectedItem={selection}
                    onRenameSuccess={() => {
                        loadBin(
                            navStack[
                                navStack.length - 1
                            ].id
                        )
                    }}
                />
            </h1>
            <h2>{`${navStack[navStack.length - 1].ancestor_path}/${navStack[navStack.length - 1].name}`.replace(/\/+/g, "/")}</h2>
            <div>
                {navStack.length > 1 && (
                    <Button variant={'link'}
                        onClick={() => {
                            setNavStack((prev) => prev.slice(0, -1));
                        }}>
                        ..
                    </Button>
                )}
            </div>
            <div className="space-y-1">

                {bins.map((bin) => (
                    <div key={bin.id} className="flex items-center gap-2">
                        <Checkbox
                            checked={selection?.data.id === bin.id}
                            onCheckedChange={(checked) => {
                                setSelection(checked ? { itemType: 'bin', data: bin } : null)
                            }}
                        />
                        <Button variant={'link'}

                            onClick={() => {
                                setNavStack((prev) => [...prev, bin as BinRecordData]);
                            }
                            }>

                            📁 {bin.name}
                        </Button>
                    </div>
                ))}



                {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-2">
                        <Checkbox
                            checked={selection?.data.id === file.id}
                            onCheckedChange={(checked) => {
                                setSelection(checked ? { itemType: "file", data: file } : null)
                            }}
                        />
                        <div
                            className="rounded border px-2 py-1"
                        >
                            📄 {file.file_name}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}