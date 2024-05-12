import { ColorType, DeepPartial, ISeriesApi, LastPriceAnimationMode, LineData, LineSeriesOptions, LineStyleOptions, SeriesOptionsCommon, Time, UTCTimestamp, WhitespaceData, createChart } from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Data } from './App';

interface RealTimeChartProps {
    data: Data[],
}

interface Arr {
    time: UTCTimestamp,
    value: number,
}

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
    const [series, setSeries] = useState<ISeriesApi<"Line", Time, LineData<Time> | WhitespaceData<Time>, LineSeriesOptions, DeepPartial<LineStyleOptions & SeriesOptionsCommon>>>();
    const [arr, setArr] = useState<Arr[]>([]);
    const animate = () => {
        series?.setData(arr);
    };

    useAnimationFrame(animate);

    useEffect(() => {
        if (props.data.length > 0) {
            setArr(prevArr => [...prevArr, { time: (prevArr[prevArr.length - 1]?.time >= (props.data[0].prevTime / 1000)) ? (prevArr[prevArr.length - 1]?.time + 1) as UTCTimestamp : (props.data[0].prevTime / 1000) as UTCTimestamp, value: props.data[0].now }]);
        }
    }, [props.data]);

    useEffect(
        () => {
            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
            };
            const chart = createChart(chartContainerRef.current!, {
                width: chartContainerRef.current?.clientWidth,
                height: 300,
                layout: {
                    background: {
                        color: '#000000'
                    },
                    textColor: '#ffffff'
                },
                timeScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                    timeVisible: true,
                    secondsVisible: true,
                }
            });
            // chart.timeScale().fitContent();

            setSeries(chart.addLineSeries());

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);

                chart.remove();
            };
        },
        []
    );

    return (
        <>
            <div
                ref={chartContainerRef}
            />
        </>
    );
}