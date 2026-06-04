// import { useBinNavigation } from "@/components/BinNavigation";
// import { Button } from "@/components/ui/button";
// import { CreateBinInput } from "@/lib/types";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from '@/components/ui/dialog'
// import { Input } from '@/components/ui/input'
import React, { useState } from "react";
// import CreateBin from "@/components/CreateBin";

const CreateStoreButton = () => {
    const handleCreateStore = async () => {
        const result = await window.store.check()

        if (!result.exists) {
            await window.store.create()
        }
    }

    const testhandler = async () => {
        await window.store.test();
        console.log("just ran test handler");
    }
    return (
        <Button onClick={handleCreateStore}>
            Create Store
        </Button>
    )
}

const IdentifyFileTypeButton = ({ pth }: { pth: string }) => {
    const handleIdentify = async () => {
        console.log(typeof (pth));
        let res = await window.file.identify(pth);
        console.log(res);
    }
    return (
        <>
            <Button onClick={handleIdentify}>
                identify
            </Button>
        </>
    )
}

const IngestButton = () => {
    const [loading, setLoading] = useState(false);
    const { navStack } = useBinNavigation();

    async function handleIngest() {
        try {
            setLoading(true)

            // Open native file picker
            const result = await window.file.pick()

            if (!result || result.canceled) {
                return
            }

            // Entire ingestion handled by backend
            const ingestResult = await window.file.ingest(
                result.path,
                navStack[navStack.length - 1]
            )

            console.log(ingestResult)

            if (!ingestResult.success) {
                alert("Ingestion failed")
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
        <Button
            onClick={handleIngest}
            disabled={loading}
        >
            {loading ? "Processing..." : "Add Media"}
        </Button>
    )
}

// const CreateBin = () => {
//     const { currentBinId } = useBinNavigation()
//     const [open, setOpen] = useState(false)
//     const [name, setName] = useState('')
//     const [loading, setLoading] = useState(false)

//     async function handleCreateBin() {
//         if (!name.trim()) return
//         try {
//             setLoading(true)

//             const res =
//                 await window.store.createBin({
//                     name,
//                     parentId: currentBinId,
//                 })

//             console.log(res)
//             setName('')
//             setOpen(false)

//         } catch (error) {
//             console.error(error)

//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <Dialog
//             open={open}
//             onOpenChange={setOpen}
//         >
//             <DialogTrigger asChild>
//                 <Button>
//                     Create Bin
//                 </Button>
//             </DialogTrigger>

//             <DialogContent>

//                 <DialogHeader>
//                     <DialogTitle>
//                         Create Bin
//                     </DialogTitle>

//                     <DialogDescription>
//                         Enter a name for the new bin.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <Input
//                     placeholder="Bin name"
//                     value={name}
//                     onChange={(e) =>
//                         setName(e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                             handleCreateBin()
//                         }
//                     }}
//                 />

//                 <DialogFooter>
//                     <Button
//                         onClick={handleCreateBin}
//                         disabled={
//                             loading ||
//                             !name.trim()
//                         }
//                     >
//                         {loading
//                             ? 'Creating...'
//                             : 'Create'}
//                     </Button>
//                 </DialogFooter>

//             </DialogContent>
//         </Dialog>
//     )
// }


const Butt = () => (
    <div>
        <h1>Button page</h1>
        {/* <CreateStoreButton /> */}
        {/* <IdentifyFileTypeButton pth="C:\Users\vishn\Downloads\raybox.png" /> */}
        {/* <IngestButton />
        <CreateBin /> */}
    </div>
);

export default Butt;