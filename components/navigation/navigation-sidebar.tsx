import { currentProfle } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { UserButtonWrapper } from "../user-button-wrapper";
  


export const NavigationSidebar = async () => {
    try {
        const profile = await currentProfle();
        if (!profile) {
            return redirect('/');
        }

        const servers = await db.server.findMany({
            where: {
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
        });

        

        return (
            <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
                <NavigationAction />
                <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
                <ScrollArea className="flex-1 w-full">
                    {servers.map((server) => (
                        <div className="mb-4" key={server.id}>
                            <NavigationItem
                                id={server.id}
                                imageUrl={server.imageUrl}
                                name={server.name}
                            />
                        </div>
                    ))}
                </ScrollArea>
                <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                    <ModeToggle />
                    {/* <UserButton
                        // afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-[48px] w-[48px] rounded-[24px] overflow-hidden",
                            },
                        }}
                    /> */}
                      <UserButtonWrapper />
                </div>
            </div>
        );
    } catch (error) {
        console.log("Error fetching profile or servers:", error);
        return <div>Error loading sidebar</div>; // Display an error message or fallback UI
    }
};


