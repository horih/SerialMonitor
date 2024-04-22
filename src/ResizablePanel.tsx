import React, { useState } from 'react';
import './App.css';

interface ColResizablePanelsProps {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
    width: number;
    setWidth: React.Dispatch<React.SetStateAction<number>>;
}
export const ColResizablePanels: React.FC<ColResizablePanelsProps> = ({ leftContent, rightContent, width, setWidth }: ColResizablePanelsProps) => {
    const [mouseDown, setMouseDown] = useState(false);

    const handleMouseDown = (event: { preventDefault: () => void; }) => {
        setMouseDown(true);
        event.preventDefault();
    };

    const handleMouseUp = (_event: any) => {
        setMouseDown(false);
    };

    const handleMouseMove = (event: { pageX: React.SetStateAction<number>; }) => {
        if (mouseDown) {
            setWidth(event.pageX);
        }
    };

    return (
        <div
            className="Atext-center h-full w-full flex"
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div style={{ width: width }}>{leftContent}</div>
            <div className="w-3 bg-black flex items-center">
                <svg
                    onMouseDown={handleMouseDown}
                    className="cursor-col-resize"
                    viewBox="0 0 16 16"
                    fill="#FFFFFF"
                >
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                </svg>
            </div>
            <div>{rightContent}</div>
        </div>
    );
};

interface RowResizablePanelsProps {
    topContent: React.ReactNode;
    bottomContent: React.ReactNode;
    height: number;
    setHeight: React.Dispatch<React.SetStateAction<number>>;
};

export const RowResizablePanels: React.FC<RowResizablePanelsProps> = ({ topContent, bottomContent, height, setHeight }: RowResizablePanelsProps) => {

    const [mouseDown, setMouseDown] = useState(false);

    const handleMouseDown = (event: React.MouseEvent) => {
        setMouseDown(true);
        event.preventDefault();
    };

    const handleMouseUp = () => {
        setMouseDown(false);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (mouseDown) {
            setHeight(event.clientY);
        }
    };

    return (
        <div
            className="flex flex-col h-full w-full"
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div style={{ height: height }}>
                {topContent}</div>
            <div className="h-4 bg-black flex items-center justify-center">
                
                <svg
                    onMouseDown={handleMouseDown}
                    className="cursor-row-resize"
                >
                    <div className="divider"></div>
                    {/* <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path> */}
                </svg>
            </div>
            <div className="flex-grow">{bottomContent}</div>
        </div>
    );
};
