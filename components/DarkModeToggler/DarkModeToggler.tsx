import { Switch } from '@headlessui/react'
import { useTheme } from 'next-themes';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const DarkModeToggler = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div>
            <label className="block text-sm font-medium leading-6">
                Appearance
            </label>
            <select
                id="theme"
                name="theme"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10  ring-1 ring-inset ring-neutral-300 dark:ring-neutral-400/20 focus:ring-2 focus:ring-cesium-900 dark:bg-neutral-800"
                value={theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Follow System"}
                onChange={(e) => setTheme(e.target.value === "Light" ? "light" : e.target.value === "Dark" ? "dark" : "system")}
                >
                    <option>Follow System</option>
                    <option>Dark</option>
                    <option>Light</option>                
            </select>
        </div>
    )
}

export default DarkModeToggler;
