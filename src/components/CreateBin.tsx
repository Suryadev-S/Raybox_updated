import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import React, { useState } from "react";
import { useBinNavigation } from './BinNavigation';
import { Button } from './ui/button';

const CreateBin = () => {
    const { navStack } = useBinNavigation()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleCreateBin() {
        if (!name.trim()) return
        try {
            setLoading(true)

            const res =
                await window.store.createBin({
                    name,
                    parentId: navStack[navStack.length - 1].id,
                })

            console.log(res)
            setName('')
            setOpen(false)

        } catch (error) {
            console.error(error)

        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button>
                    Create Bin
                </Button>
            </DialogTrigger>

            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        Create Bin
                    </DialogTitle>

                    <DialogDescription>
                        Enter a name for the new bin.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Bin name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleCreateBin()
                        }
                    }}
                />

                <DialogFooter>
                    <Button
                        onClick={handleCreateBin}
                        disabled={
                            loading ||
                            !name.trim()
                        }
                    >
                        {loading
                            ? 'Creating...'
                            : 'Create'}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}

export default CreateBin;