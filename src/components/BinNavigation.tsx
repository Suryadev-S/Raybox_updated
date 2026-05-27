import { createContext, ReactNode, useContext, useState } from "react"

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
        useState<string | null>(null)

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