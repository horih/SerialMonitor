import { SetStateAction, Dispatch, useState } from 'react';

interface ConnectionButtonProps {
    port: SerialPort | undefined,
    setPort: Dispatch<SetStateAction<SerialPort | undefined>>,
};

const ConnectionButton = (props: ConnectionButtonProps) => {
    const [baudrate, setBaudRate] = useState<number>(9600);
    const [command, setCommand] = useState<string>("");
    const [end, setEnd] = useState<string>("");
    const connectToSerial = async () => {
        try {
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: baudrate });
            console.log('Connect SerialPort ');
            props.setPort(port);
        } catch (error) {
            console.error('Cannot Connect to SerialPort', error);
        }
    };

    const disconnectFromSerial = async () => {
        if (props.port && props.port.readable) {
            await props.port.close();
            console.log('DisConnect SerialPort');
            props.setPort(undefined);
        }
    };

    const sendCommand = async () => {
        if (props.port?.writable) {
            const encoder = new TextEncoder();
            const writer = props.port.writable.getWriter();
            await writer.write(encoder.encode(command + end));
            console.log(command+end)
            writer.releaseLock();
        }
    }

    const clearCommand = () => {
        setCommand("");
    }

    return (
        <div className='grid grid-cols-2 gap-1'>
            <div className="card w-full bg-neutral text-neutral-content">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Connection</h2>
                    <div className='grid grid-cols-1 gap-4'>
                        <select className="select select-ghost w-full max-w-xs" defaultValue={9600} value={baudrate} onChange={(e) => setBaudRate(Number(e.target.value))}>
                            <option disabled selected>Pick the your baudrate</option>
                            <option>9600</option>
                            <option>19200</option>
                            <option>38400</option>
                            <option>115200</option>
                            <option>1000000</option>
                            <option>2000000</option>
                        </select>
                        <div className='grid grid-cols-2 gap-4'>
                            <button onClick={connectToSerial} type="button" className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">Connect</button>
                            <button onClick={disconnectFromSerial} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">DisConnect</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card w-full bg-neutral text-neutral-content">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Command</h2>
                    <div className='grid grid-cols-1 gap-4'>
                    <div className="join">
                        <input type="text" placeholder="Type here" value={command} onChange={(e) => { setCommand(e.target.value) }} className="input input-bordered w-full max-w-xs" />
                        <select onChange={(e)=>setEnd(e.target.value)} className="select select-bordered join-item">
                            <option disabled selected>End</option>
                            <option>\r\n</option>
                            <option>\n</option>
                            <option>\r</option>
                            <option value={""}>None</option>
                        </select>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <button onClick={sendCommand} type="button" className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">Send</button>
                            <button onClick={clearCommand} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Clear</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
};

export default ConnectionButton;
