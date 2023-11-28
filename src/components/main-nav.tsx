import { Avatar, Button, CircularProgress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";

import appConfig from "@/appConfig";
import { Moon, Search, Sun } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Logo from "./logo";
import NewPostButton from "./new-post-button";


const ProfileMenu = () => {
    const { theme, setTheme } = useTheme()
    const session = useSession()

    if (session.status === 'loading') {
        return (
            <CircularProgress aria-label="Loading..." />
        )
    } else if (session.status === 'unauthenticated') {
        return (
            <Button color='primary' onPress={() => signIn()}>Login / Register</Button>
        )
    } else {
        const user = session.data!.user
        return (
            <Dropdown placement="bottom-end" closeOnSelect={false}>
                <DropdownTrigger>
                    {user.image ? (
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="primary"
                            name={user.name ?? undefined}
                            size="sm"
                            src={user.image}
                        />
                    ) : (
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color='primary'
                            name={user.name?.split(' ').map(value => value[0]).filter(value => value !== ' ').join('').toUpperCase()}
                            size="sm"
                        />
                    )}
                </DropdownTrigger>
                <DropdownMenu bria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-semibold">{user.email}</p>
                    </DropdownItem>
                    <DropdownItem key="settings">My Settings</DropdownItem>
                    <DropdownItem key="team_settings">Team Settings</DropdownItem>
                    <DropdownItem key="analytics">Analytics</DropdownItem>
                    <DropdownItem key="system">System</DropdownItem>
                    <DropdownItem key="configurations">Configurations</DropdownItem>
                    <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                    <DropdownItem
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('hi')
                            setTheme(theme === 'dark' ? 'light' : 'dark')
                        }}
                        key="theme"
                        className="flex flex-row justify-start items-center"
                        endContent={(
                            <>
                                <Sun className="h-4 dark:hidden" />
                                <Moon className="h-4 hidden dark:block" />
                            </>
                        )}
                    >
                        <span className="dark:hidden">Theme: Light</span>
                        <span className="hidden dark:block">Theme: Dark</span>
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
                        Log Out
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        )
    }

}

export default function MainNav() {
    const session = useSession()
    return (
        <Navbar isBordered>
            <NavbarContent justify="start">
                <NavbarBrand className="mr-4">
                    <Logo className="w-6 h-6 mr-2" />
                    <p className="hidden sm:block font-bold text-inherit">{appConfig.title}</p>
                </NavbarBrand>
            </NavbarContent>
            {/* <NavbarContent className="hidden sm:flex gap-3">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page" color="secondary">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent> */}


            <NavbarContent as="div" className="w-auto items-center" justify="end">

                {session.status === 'authenticated' && (
                    <NewPostButton />
                )}
                <Input
                    classNames={{
                        base: "max-w-full sm:max-w-[10rem] h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                    }}
                    placeholder="Type to search..."
                    size="sm"
                    startContent={<Search />}
                    type="search"
                />
                <ProfileMenu />
            </NavbarContent>
        </Navbar>
    );
}
