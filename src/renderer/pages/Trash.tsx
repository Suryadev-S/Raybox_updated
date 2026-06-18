import { Button } from '@renderer/components/ui/button'
import { Checkbox } from '@renderer/components/ui/checkbox'
import { useEffect, useState } from 'react'

type DeletedItem = {
    id: string
    name: string
    recordType: 'file' | 'bin'
    ancestor_path: string
    deleted_at: string
}

export default function Trash() {
    const [deletedItems, setDeletedItems] = useState<
        DeletedItem[]
    >([])

    const [selectedIds, setSelectedIds] = useState<
        Set<string>
    >(new Set())

    useEffect(() => {
        loadDeletedItems()
    }, [])

    async function loadDeletedItems() {
        const data =
            await window.store.getDeleted()

        setDeletedItems(data)
    }

    function toggleSelection(
        id: string,
        checked: boolean
    ) {
        setSelectedIds((prev) => {
            const next = new Set(prev)

            if (checked) {
                next.add(id)
            } else {
                next.delete(id)
            }

            return next
        })
    }

    function handleSelectAll() {
        setSelectedIds(
            new Set(
                deletedItems.map(
                    (item) => item.id
                )
            )
        )
    }

    async function handlePurgeAll() {
        await window.store.purge()

        setSelectedIds(new Set())

        await loadDeletedItems()
    }

    const allSelected =
        deletedItems.length > 0 &&
        selectedIds.size ===
        deletedItems.length

    return (
        <div className="p-4">

            <h1 className="mb-4 text-lg font-bold">
                Trash
            </h1>

            <div className="mb-4 flex gap-2">

                <Button
                    onClick={handleSelectAll}
                    disabled={
                        selectedIds.size === 0
                    }
                >
                    Select All
                </Button>

                <Button
                    variant="destructive"
                    onClick={handlePurgeAll}
                    disabled={!allSelected}
                >
                    Purge All
                </Button>

            </div>

            <div className="space-y-2">

                {deletedItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-2 border rounded p-2"
                    >
                        <Checkbox
                            checked={selectedIds.has(
                                item.id
                            )}
                            onCheckedChange={(
                                checked
                            ) =>
                                toggleSelection(
                                    item.id,
                                    !!checked
                                )
                            }
                        />

                        <span>
                            {item.recordType ===
                                'bin'
                                ? '📁'
                                : '📄'}
                        </span>

                        <span>
                            {item.name}
                        </span>
                    </div>
                ))}

            </div>

        </div>
    )
}