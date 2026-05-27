import { useEffect, useState } from 'react'

interface Bin {
    id: string
    name: string
}

interface FileItem {
    id: string
    name: string
    type: string
}

export default function Media() {
    // hardcoded root
    const ROOT_BIN_ID = '7fb34ae6-2a44-4734-9ec0-bec22ee3a8fb'

    const [currentBinId, setCurrentBinId] =
        useState(ROOT_BIN_ID)

    const [bins, setBins] = useState<Bin[]>([])
    const [files, setFiles] = useState<FileItem[]>([])

    useEffect(() => {
        loadBin(currentBinId)
    }, [currentBinId])

    async function loadBin(binId: string) {
        const data =
            await window.store.getBin(
                binId
            )

        setBins(data.bins)
        setFiles(data.files)
    }

    return (
        <div className="p-4">

            <h1 className="mb-4 text-lg font-bold">
                Explorer
            </h1>

            <div className="space-y-1">

                {bins.map((bin) => (
                    <button
                        key={bin.id}
                        onClick={() =>
                            setCurrentBinId(bin.id)
                        }
                        className="block w-full rounded border px-2 py-1 text-left"
                    >
                        📁 {bin.name}
                    </button>
                ))}

                {files.map((file) => (
                    <div
                        key={file.id}
                        className="rounded border px-2 py-1"
                    >
                        📄 {file.name}
                    </div>
                ))}

            </div>
        </div>
    )
}