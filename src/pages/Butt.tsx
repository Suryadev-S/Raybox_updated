import { Button } from "@/components/ui/button";
import { CreateBinInput } from "@/lib/types";
import React, { useState } from "react";

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
    const [loading, setLoading] = useState(false)

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

const CreateBin = ({ name, parentId }: CreateBinInput) => {
    const handleCreateBin = async () => {
        const res = await window.store.createBin({ name, parentId });
        if (res) {
            console.log(res.name);
        }
    }

    return (
        <Button onClick={handleCreateBin}>Create Bin</Button>
    )
}


const Butt = () => (
    <div>
        <h1>Button page</h1>
        {/* <CreateStoreButton /> */}
        {/* <IdentifyFileTypeButton pth="C:\Users\vishn\Downloads\raybox.png" /> */}
        <IngestButton />
        <CreateBin name="testBinChild" parentId={'fc14ac11-50bf-48f6-b70a-96bfed7208ec'} />
    </div>
);

export default Butt;