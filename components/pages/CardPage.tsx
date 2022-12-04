import { FC, useState } from "react"
import { IPage } from "../../interfaces"

import NextImage from 'next/image'

interface Props {
    page: IPage
}

export const CardPage: FC<Props> = ({ page }) => {


    const [showOptions, setShowOptions] = useState(false)


    return (
        <div className="mb-2">
            <header className="flex justify-between items-center border bg-white rounded py-2 px-5">
                <div>
                    {page.img
                        ? (
                            <NextImage
                                priority
                                width={64}
                                height={64}
                                src={page.img}
                                alt={page.name}
                                className='rounded-full shadow'
                            />
                        ) : (
                            <div className="w-[64px] h-[64px] shadow bg-slate-200 rounded-full flex justify-center items-center">
                                <span className="font-bold text-xl uppercase">{page.name.slice(0, 1)}</span>
                            </div>
                        )
                    }
                </div>
                <h3 className="text-slate-800 text-xl font-bold">{ page.name }</h3>
                <div
                    // onMouseOut={()=>setShowOptions(false)}
                    className='relative'
                >
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className='hover:bg-slate-100 rounded active:scale-95 p-1'
                    >
                        <i className='bx bx-dots-vertical text-slate-800'></i>
                    </button>
                    {
                        showOptions &&
                        <div className="origin-top-right absolute right-2 mt-0 w-40 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none flex justify-center hover:bg-gray-100" role="menu">
                            <button
                                // onClick={logout}
                                className="text-gray-700 flex items-center justify-center text-sm gap-1 px-2 py-2 hover:text-gray-900">
                                <i className='bx bx-log-out' ></i>
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    }
                </div>
            </header>
            <div>

            </div>
        </div>
    )
}
