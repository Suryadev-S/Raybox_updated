import { useBinNavigation } from '@/components/BinNavigation'
import CreateBin from '@/components/CreateBin'
import { Button } from '@/components/ui/button'
import { BinRecordData } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Bin {
    id: string
    name: string
    ancestor_path: string
}

interface FileItem {
    id: string
    name: string
    type: string
}

export default function Media() {
    // const { currentBinId, setCurrentBinId, prevBinIdStack, setPrevBinIdStack } = useBinNavigation();
    const { navStack, setNavStack } = useBinNavigation();

    const [bins, setBins] = useState<Bin[]>([])
    const [files, setFiles] = useState<FileItem[]>([])

    // console.log(currentBinId);
    // console.log(prevBinIdStack);
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

    return (
        <div className="p-4">

            <h1 className="mb-4 text-lg font-bold">
                Explorer with bin
                <br />
                <CreateBin />
            </h1>
            <h2>{`${navStack[navStack.length - 1].ancestor_path}/${navStack[navStack.length - 1].name}`.replace(/\/+/g, "/")}</h2>
            <div>
                {navStack.length > 1 && (
                    <Button variant={'link'}
                        onClick={() => {
                            // const temp = prevBinIdStack.slice(); 
                            // setCurrentBinId(() => temp.pop() as string);
                            // setPrevBinIdStack(() => [...temp]);
                            setNavStack((prev) => prev.slice(0, -1));
                        }}>
                        ..
                    </Button>
                )}
            </div>
            <div className="space-y-1">

                {bins.map((bin) => (
                    <div key={bin.id}>
                        <Button variant={'link'}

                            onClick={() => {
                                // setPrevBinIdStack((prev) => [...prev, currentBinId as string])
                                // setCurrentBinId(() => bin.id)
                                setNavStack((prev) => [...prev, bin as BinRecordData]);
                            }
                            }>

                            📁 {bin.name}
                        </Button>
                    </div>
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