import { useRef, useEffect } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { WebglAddon } from '@xterm/addon-webgl';

export default function MessageDisp() {
    const ref = useRef<HTMLDivElement | null>(null)
    const term = useRef<Terminal>(new Terminal());

    useEffect(() => {
        const fitAddon = new FitAddon();
        const webglAddon = new WebglAddon();
        term.current.loadAddon(fitAddon);
        term.current.loadAddon(webglAddon);
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