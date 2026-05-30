import { BinRecordData } from "@/lib/types"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

type BinNavigationContextType = {
    //     currentBinId: string | null
    //     setCurrentBinId: React.Dispatch<React.SetStateAction<string>>
    //     prevBinIdStack: string[]
    //     setPrevBinIdStack: React.Dispatch<React.SetStateAction<string[]>>
    navStack: BinRecordData[]
    setNavStack: React.Dispatch<React.SetStateAction<BinRecordData[]>>
}

const BinNavigationContext =
    createContext<BinNavigationContextType | null>(null)

export function BinNavigationProvider({
    children,
}: {
    children: ReactNode
}) {
    // const [currentBinId, setCurrentBinId] =
    //     useState<string | null>(null);
    // const [prevBinIdStack, setPrevBinIdStack] =
    //     useState<string[]>([]);

    const [navStack, setNavStack] = useState<BinRecordData[]>([]);

    useEffect(() => {
        async function initializeRootBin() {
            const root =
                await window.store.getRootBinId()

            // setCurrentBinId(rootId)
            setNavStack((prev) => [...prev, root])
        }

        initializeRootBin()
    }, [])

    return (
        <BinNavigationContext
            value={{
                // currentBinId,
                // setCurrentBinId,
                // prevBinIdStack,
                // setPrevBinIdStack
                navStack,
                setNavStack
            }}
        >
            {children}
        </BinNavigationContext>
    )
}

export function useBinNavigation() {
    const context = useContext(BinNavigationContext)

    if (!context) {
        throw new Error(
            'useBinNavigation must be used within BinNavigationProvider'
        )
    }

    return context
}