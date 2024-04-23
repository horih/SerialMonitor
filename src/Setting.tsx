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
                    <h2 className="card-title">Setting</h2>
                    <div className="grid grid-cols-2">
                        <h1 className="card-title">Number of Groups</h1>
                        <input type="text" value={props.groups} onChange={(e) => { props.setGroups(Number(e.target.value)) }} placeholder="Type here" className="input input-ghost w-full max-w-xs" />
                    </div>
                    <div className="grid grid-cols-2">
                        <h1 className="card-title">Display Type</h1>
                        <select value={props.disp} onChange={(e) => { props.setDisp(Number(e.target.value)) }} className="select bg-neutral w-full max-w-xs">
                            <option disabled selected>Display Type</option>
                            <option value={0}>Stack</option>
                            <option value={1}>Tab</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
}