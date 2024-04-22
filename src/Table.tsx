import { Dispatch, SetStateAction } from "react";

interface TableProps {
    values: { [key: string]: number[] }
}

interface DataProps {
    active : boolean,
    setActive : Dispatch<SetStateAction<boolean>>,
    group : number,
    setNumber : Dispatch<SetStateAction<boolean>>,
    
}



function Data() {
    return (
        <>
            <tr className="hover">
                <th>2</th>
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
            </tr>
        </>
    );
}

export default function Table({ }) {

    return (
        <>
            <div className="card w-full bg-neutral text-neutral-content">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Data Label</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Active</th>
                                    <th>Group</th>
                                    <th>Name</th>
                                    <th>Average</th>
                                    <th>Max</th>
                                    <th>Min</th>
                                    <th>Hz</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>
    );
};
