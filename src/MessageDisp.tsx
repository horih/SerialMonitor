import { useRef, useEffect } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

interface MessageProps {
    message: string[],
    setMessage : React.Dispatch<React.SetStateAction<string[]>>,
};

export default function MessageDisp(props: MessageProps) {
    const ref = useRef<HTMLDivElement | null>(null)
    const term = useRef<Terminal>(new Terminal());


    useEffect(() => {
        if (props.message.length > 0){
            props.message.forEach(value => {term.current.writeln(value);})
            props.setMessage([]);
        }
    }, [props.message])

    useEffect(() => {
        const fitAddon = new FitAddon();
        term.current.loadAddon(fitAddon);
        if (!ref.current) {
            return;
        }
        term.current.open(ref.current)
        fitAddon.fit();
        window.addEventListener('resize', () => {
            fitAddon.fit();
        });
        return (() => {
        })
    }, [])
    return (
        <>
            <div className="mockup-code m-2">
                <div ref={ref}></div>
            </div>
        </>
    );
}