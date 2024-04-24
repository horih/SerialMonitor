import { Dispatch, SetStateAction } from "react";
import { Data } from "./App";

interface TableProps {
    data: { [key: string]: Data },
    group : number
    setActive: (name: string, value: boolean) => void;
    setGroup: (name: string, value: number) => void;
}

interface CellProps {
    data: Data,
    num: number,
    name: string,
    group: number,
    setActive: (name: string, value: boolean) => void;
    setGroup: (name: string, value: number) => void;
}

function Cell(props: CellProps) {
    return (
        <>
            <tr className="hover">
                <th>{String(props.num)}</th>
                <td><input type="checkbox" onChange={(e) => {props.setActive(props.name,!props.data.active)}} defaultChecked className="checkbox" /></td>
                <td>
                    <select onChange={(e) => {props.setGroup(props.name, Number(e.target.value))}} className="select select-bordered select-xs w-full max-w-xs">
                        <option disabled selected>Group</option>
                        {Array.from({ length: props.group }).map((_, index) => (
                            <option key={index} value={index}>Group {index + 1}</option>
                        ))}
                    </select>
                </td>
                <td>{props.name}</td>
                <td>{props.data.now}</td>
                <td>{props.data.average}</td>
                <td>{props.data.max}</td>
                <td>{props.data.min}</td>
                <td>{props.data.hz}</td>
            </tr>
        </>
    );
}

export default function Table(props: TableProps) {

    return (
        <>
            <div className="card w-full h-2/3 flex flex-col m-2 bg-neutral text-neutral-content overflow-auto">
                <div className="card-body items-center text-center">
                    <div className="">
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Active</th>
                                    <th>Group</th>
                                    <th>Name</th>
                                    <th>Now</th>
                                    <th>Average</th>
                                    <th>Max</th>
                                    <th>Min</th>
                                    <th>Hz</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.data && Object.entries(props.data).map(([key, value], index) => (
                                    <Cell data={value} name={key} num={index} group={props.group} setActive={props.setActive} setGroup={props.setGroup}/>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};
