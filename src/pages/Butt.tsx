import { Button } from "@/components/ui/button";
import React from "react";

const Butt = () => (
    <div>
        <h1>Button page</h1>
        <CreateStoreButton />
    </div>
);

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
export default Butt;