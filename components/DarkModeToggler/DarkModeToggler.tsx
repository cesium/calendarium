import { Switch } from '@headlessui/react'
import {useTheme} from 'next-themes';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const DarkModeToggler = () => {
    const {theme, setTheme} = useTheme();

    return (
        <div>
            <label className="block text-sm font-medium leading-6">
                Dark Mode
            </label>
            <Switch
                checked={theme === 'dark'}
                onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={classNames(
                    theme === 'dark' ? 'bg-cesium-900' : 'bg-neutral-200 dark:bg-neutral-700',
                    'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cesium-900 focus:ring-offset-2'
                )}
            >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={classNames(
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
            />
            </Switch>
        </div>
    )
}

export default DarkModeToggler;
