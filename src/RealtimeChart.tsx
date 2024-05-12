import { ColorType, LastPriceAnimationMode, LineData, UTCTimestamp, createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { Data } from './App';

interface RealTimeChartProps {
    data: Data[],
}

interface Arr {
    time: UTCTimestamp,
    value: number,
}


export default function RealTimeChart(props: RealTimeChartProps) {

    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [arr, setArr] = useState<Arr[]>([]);

    useEffect(
        () => {
            if(props.data.length>0){
                setArr(prevArr => [...prevArr, { time: (Date.now() / 1000) as UTCTimestamp, value: props.data[0].now }]);
            }
            
            if (arr.length > 10000) {
                setArr(prevArr => prevArr.slice(1));
            }
            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
            };
            const chart = createChart(chartContainerRef.current!, {
                width: chartContainerRef.current?.clientWidth,
                height: 300,
                timeScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                    timeVisible: true,
                    secondsVisible: true,
                }
            });
            chart.timeScale().fitContent();

            const newSeries = chart.addLineSeries();

            newSeries.setData(arr);

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);

                chart.remove();
            };
        },
        [props.data]
    );

    return (
        <>
            <div
                ref={chartContainerRef}
            />
        </>
    );
}