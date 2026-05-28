import { createContext, ReactNode, useContext, useEffect, useState } from "react"

type BinNavigationContextType = {
    currentBinId: string | null
    setCurrentBinId: (id: string | null) => void
}

const BinNavigationContext =
    createContext<BinNavigationContextType | null>(null)

export function BinNavigationProvider({
    children,
}: {
    children: ReactNode
}) {
    const [currentBinId, setCurrentBinId] =
        useState<string | null>(null);

    useEffect(() => {
        async function initializeRootBin() {
            console.log("inside init root bin in renderer");
            const rootId =
                await window.store.getRootBinId()

            setCurrentBinId(rootId)
        }

        initializeRootBin()
    }, [])

    return (
        <BinNavigationContext
            value={{
                currentBinId,
                setCurrentBinId,
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