import React, { FC } from 'react'

interface Props{
    value: boolean
    onCheckChange: () => void
    label?: string
}

export const Checkbox:FC<Props> = ( {value, onCheckChange, label} ) => {


    return (
        <div className="flex flex-col items-start">
            {
                label && (
                    <p className="font-medium text-gray-900 dark:text-gray-300 mb-1">{ label }</p>
                )
            }
            <div className={`p-1 rounded-lg flex items-center ${ label ? ' py-2 px-3 border' : '' }`}>
                <label htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id="default-toggle"
                        checked={value}
                        onChange={onCheckChange}
                        className="sr-only peer"
                    />
                    <div
                        className={`w-[2.8rem] h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-indigo-700 peer-checked:to-blue-700`}
                    >
                    </div>
                </label>
            </div>
        </div>
    )
}
