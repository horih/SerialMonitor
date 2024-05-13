import { DeepPartial, ISeriesApi, LineData, LineSeriesOptions, LineStyleOptions, SeriesOptionsCommon, Time, UTCTimestamp, WhitespaceData, createChart } from 'lightweight-charts';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Data } from './App';

interface RealTimeChartProps {
    data: Data[],
}

interface Arr {
    time: UTCTimestamp,
    value: number,
}

const useWindowSize = (): number[] => {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        const updateSize = (): void => {
            setSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
};

const useAnimationFrame = (callback = () => { }) => {
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


export default function RealTimeChart(props: RealTimeChartProps) {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [series, setSeries] = useState<ISeriesApi<"Line", Time, LineData<Time> | WhitespaceData<Time>, LineSeriesOptions, DeepPartial<LineStyleOptions & SeriesOptionsCommon>>[]>([]);
    const [arr, setArr] = useState<Arr[][]>([]);
    const [width, height] = useWindowSize();

    const animate = () => {
        series.forEach((s, index) => {
            s.setData(arr[index]);
        });
    };

    useAnimationFrame(animate);

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
        const handleResize = () => {
            chart.applyOptions({ width: width / 2});
        };
        const chart = createChart(chartContainerRef.current!, {
            width: width / 2,
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
        chart.timeScale().fitContent();
        setArr([]);
        const newSeries = props.data.map(() => chart.addLineSeries({ lineType: 0 }));
        setSeries(newSeries);
        return () => {
            chart.remove();
        };
    }, [props.data.length, window]);

    return (
        <>
            <div ref={chartContainerRef} />

        </>
    );
}