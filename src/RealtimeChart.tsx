import { DeepPartial, ISeriesApi, LineData, LineSeriesOptions, LineStyleOptions, SeriesOptionsCommon, Time, UTCTimestamp, WhitespaceData, createChart } from 'lightweight-charts';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Data } from './App';

interface RealTimeChartProps {
    data: Data[],
    width : number,
}

interface Arr {
    time: UTCTimestamp,
    value: number,
}

export const useAnimationFrame = (callback = () => { }) => {
    const reqIdRef = useRef<number>();
    const loop = useCallback(() => {
        reqIdRef.current = requestAnimationFrame(loop);
        callback();
    }, [callback]);

    useEffect(() => {
        reqIdRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(reqIdRef.current!);
    }, [loop]);
}

export function animate(series: ISeriesApi<"Line", Time, LineData<Time> | WhitespaceData<Time>, LineSeriesOptions, DeepPartial<LineStyleOptions & SeriesOptionsCommon>>[], arr: Arr[][]) {
    series.forEach((s, index) => {
        if (arr[index].length > 1000) {
            s.setData(arr[index].slice(arr[index].length - 1000, arr[index].length - 1))
        } else {
            s.setData(arr[index]);
        }

    });
};


export default function RealTimeChart(props: RealTimeChartProps) {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [series, setSeries] = useState<ISeriesApi<"Line", Time, LineData<Time> | WhitespaceData<Time>, LineSeriesOptions, DeepPartial<LineStyleOptions & SeriesOptionsCommon>>[]>([]);
    const [arr, setArr] = useState<Arr[][]>([]);

    useAnimationFrame(() => { animate(series, arr) });

    useEffect(() => {
        if (props.data.length > 0) {
            setArr(prevArr => {
                const newArr = [...prevArr];
                props.data.forEach((data, index) => {
                    if (!newArr[index]) {
                        newArr[index] = [];
                    }
                    newArr[index].push({ time: (newArr[index][newArr[index].length - 1]?.time >= (data.prevTime / 1000)) ? (newArr[index][newArr[index].length - 1]?.time + 0.001) as UTCTimestamp : (Date.now() / 1000) as UTCTimestamp, value: data.now });
                });
                return newArr;
            });
        }
    }, [props.data]);

    useEffect(() => {
        const chart = createChart(chartContainerRef.current!, {
            width: props.width,
            height: 320,
            layout: {
                background: {
                    color: '#1d232a'
                },
                textColor: '#a6adbb'
            },
            timeScale: {
                borderColor: 'rgba(197, 203, 206, 0.8)',
                timeVisible: true,
                secondsVisible: true,
            }
        });
        // window.addEventListener('resize', handleResize);
        chart.timeScale().fitContent();
        setArr([]);
        const newSeries = props.data.map((d) => chart.addLineSeries({ lineType: 0, color: d.color }));
        setSeries(newSeries);
        return () => {
            chart.remove();
        };
    }, [props.data.length, props.width]);

    return (
        <>
            <div ref={chartContainerRef} />
        </>
    );
}