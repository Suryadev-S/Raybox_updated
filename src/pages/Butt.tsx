import { Button } from "@/components/ui/button";
import React from "react";

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
        console.log(typeof(pth));
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

const Butt = () => (
    <div>
        <h1>Button page</h1>
        {/* <CreateStoreButton /> */}
        <IdentifyFileTypeButton pth="C:\Users\vishn\Downloads\raybox.png" />
    </div>
);

export default Butt;