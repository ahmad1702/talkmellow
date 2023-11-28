// components/ThemeSwitcher.tsx
import { Button } from "@nextui-org/react";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()

    return (
        <div>
            <div className="mb-1">
                <span className="dark:hidden">
                    The current theme is: light
                </span>
                <span className="hidden dark:block">
                    The current theme is: dark
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Button startContent={<Sun className="fill-black dark:fill-transparent" />} onClick={() => setTheme('light')}>Light Mode</Button>
                <Button startContent={<Moon className="dark:fill-white" />} onClick={() => setTheme('dark')}>Dark Mode</Button>
            </div>
        </div>
    )
};