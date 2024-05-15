import { Dispatch, SetStateAction } from "react";

interface SettingProps {
    groups: number,
    setGroups: Dispatch<SetStateAction<number>>,
    disp : number,
    setDisp : Dispatch<SetStateAction<number>>,
};

export default function Setting(props: SettingProps) {

    return (
        <>
            <div className="card w-full m-2 bg-neutral text-neutral-content">
                <div className="card-body items-center text-center">
                    <div className="grid grid-cols-2">
                        <h1 className="card-title">Number of Groups</h1>
                        <select value={props.groups} onChange={(e) => { props.setGroups(Number(e.target.value)) }} className="select bg-neutral w-full max-w-xs">
                            <option disabled selected>Number</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
}