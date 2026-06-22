import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { SelectedItem } from "@shared/types"


// type RenameItem = {
//     id: string
//     name: string
//     recordType: "file" | "bin"
// }


interface RenameItemButtonProps {
    selectedItem: SelectedItem | null
    onRenameSuccess?: () => void
}


export default function RenameItemButton({
    selectedItem,
    onRenameSuccess
}: RenameItemButtonProps) {
    const [open, setOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleRename() {
        let result;

        if (!selectedItem) return

        if (!newName.trim()) {
            return
        }

        if (selectedItem.itemType === "file") {
            result = await window.store.renameFile(
                selectedItem.data.id,
                newName
            );
        } else {
            result = await window.store.renameBin(
                selectedItem.data.id,
                newName
            );
        }

        if (!result.success) {
            setError(result.reason);
            return
        }

        setError(null)
        setNewName("")
        setOpen(false)
        onRenameSuccess?.()
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >

            <DialogTrigger asChild>
                <Button
                    disabled={!selectedItem}
                >
                    Rename
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Rename
                    </DialogTitle>
                    <DialogDescription>
                        Enter new name
                    </DialogDescription>
                </DialogHeader>
                <Input
                    value={newName}
                    onChange={(e) =>
                        setNewName(
                            e.target.value
                        )
                    }
                />
                {
                    error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )
                }


                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setOpen(false)
                            setError(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRename}
                    >
                        Rename
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}