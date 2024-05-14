import { Dispatch, SetStateAction } from "react";
import { Data } from "./App";

interface TableProps {
    data: { [key: string]: Data },
    group: number
    setActive: (name: string, value: boolean) => void;
    setGroup: (name: string, value: number) => void;
    setColor: (name: string, value: string) => void;
}

interface CellProps {
    data: Data,
    num: number,
    name: string,
    group: number,
    setActive: (name: string, value: boolean) => void;
    setGroup: (name: string, value: number) => void;
    setColor: (name: string, value: string) => void;
}

function Cell(props: CellProps) {
    return (
        <>
            <tr className="hover">
                <th className="w-12">{String(props.num)}</th>
                <td className="w-12"><input type="checkbox" checked={props.data.active} onChange={() => { props.setActive(props.name, !props.data.active) }} className="checkbox" /></td>
                <td className="w-12">
                    <select onChange={(e) => { props.setGroup(props.name, Number(e.target.value)) }} className="select select-bordered select-xs w-full max-w-xs">
                        <option disabled selected>Group</option>
                        {Array.from({ length: props.group }).map((_, index) => (
                            <option key={index} value={index}>Group {index + 1}</option>
                        ))}
                    </select>
                </td>
                <td className="w-12">
                    <input type="color" value={props.data.color} onChange={(e) => {console.log(e.target.value);props.setColor(props.name,e.target.value)}} className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700" id="hs-color-input"  title="Choose your color"></input>
                </td>
                <td className="w-24">{props.name}</td>
                <td className="w-32">{props.data.now}</td>
                <td className="w-32">{props.data.average}</td>
                <td className="w-32">{props.data.max}</td>
                <td className="w-32">{props.data.min}</td>
                <td className="w-32">{props.data.hz}</td>
            </tr>
        </>
    );
}

export default function Table(props: TableProps) {

    return (
        <>
            <div className="card w-full h-fit p-1 flex flex-colm-1 bg-neutral text-neutral-content">
                <div className="card-body items-center text-center">
                    <div className="">
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th className="w-12"></th>
                                    <th className="w-12">Active</th>
                                    <th className="w-12">Group</th>
                                    <th className="w-12">Color</th>
                                    <th className="w-24">Name</th>
                                    <th className="w-32">Now</th>
                                    <th className="w-32">Average</th>
                                    <th className="w-32">Max</th>
                                    <th className="w-32">Min</th>
                                    <th className="w-32">Hz</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.data && Object.entries(props.data).map(([key, value], index) => (
                                    <Cell key={index} data={value} name={key} num={index} group={props.group} setActive={props.setActive} setGroup={props.setGroup} setColor={props.setColor}/>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};
