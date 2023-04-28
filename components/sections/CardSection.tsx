import { FC } from "react"
import { ISection } from "../../interfaces"


interface Props{
    section: ISection
}

export const CardSection:FC<Props> = ({ section }) => {
    return (
        <li className="flex w-full justify-between items-center bg-white px-3 py-2 rounded border mb-2">
            <div>
                <p className="font-semibold sm:pl-2">{ section.title }</p>
            </div>

            <div className='flex items-center gap-2'>
                <button
                    // onClick={()=>setShowFormEdit(true)}
                    className="items-center text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-500 font-bold text-sm py-2 px-3 rounded-md"
                >
                    <i className='bx bx-edit-alt' ></i>
                </button>
                <button
                    // onClick={handleShowModalDelete}
                    className="items-center text-red-600 hover:text-white bg-red-100 hover:bg-red-500 font-bold text-sm py-2 px-3 rounded-md"
                >
                    <i className='bx bx-trash'></i>
                </button>
            </div>

        </li>
    )
}
