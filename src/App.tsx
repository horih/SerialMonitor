import { useEffect, useRef, useState } from 'react'
import './App.css'
import ConnectionButton from './ConnectButton'
import RealTimeChart from './RealtimeChart'
import Table from './Table'
import Setting from './Setting'
import MessageDisp from './MessageDisp'

export interface Data {
  active: boolean,
  color: string,
  group: number,
  max: number,
  min: number,
  now: number,
  average: number,
  prevTime: number,
  count: number,
  hz: number,
};

interface PlotterProps {
  disp: number;
  disp_num: number,
  data: { [key: string]: Data }
};

interface StackProps {
  data: Data[];
}
function Stack(props: StackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();

    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);
  return (
    <div ref={containerRef} className='grid w-full h-fit'>
      <RealTimeChart data={props.data} width={width} />
    </div>
  );
}

function Plotter(props: PlotterProps) {

  const [_, setNames] = useState<string[][]>(Array(3).fill([]));
  const [data, setData] = useState<Data[][]>(Array(3).fill([]));

  useEffect(() => {
    const newNames: string[][] = Array.from({ length: 3 }, () => []);
    const newData: Data[][] = Array.from({ length: 3 }, () => []);

    for (const [key, value] of Object.entries(props.data)) {
      if (!value.active) continue;
      newNames[value.group].push(key);
      newData[value.group].push(value);
    }

    setNames(newNames);
    setData(newData);
  }, [props.data]);

  return (
    <div className=''>
      {Array.from({ length: props.disp_num }).map((_, index) => (
        <Stack key={index} data={data[index]} />
      ))}
    </div>
  );
}

function App() {

  const [port, setPort] = useState<SerialPort | undefined>();
  const [values, setValues] = useState<{ [key: string]: Data }>({});
  const [tabNum, setTabNum] = useState<number>(1);
  const [disp, setDisp] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [message, setMessage] = useState<string[]>([]);

  function setActive(name: string, value: boolean) {
    setValues(prevValues => ({
      ...prevValues,
      [name]: prevValues[name] ? { ...prevValues[name], active: value } : {} as Data,
    }));
  }

  function setColor(name: string, value: string) {
    setValues(prevValues => ({
      ...prevValues,
      [name]: prevValues[name] ? { ...prevValues[name], color: value } : {} as Data,
    }));
  }

  function setGroup(name: string, value: number) {
    setValues(prevValues => ({
      ...prevValues,
      [name]: prevValues[name] ? { ...prevValues[name], group: value } : {} as Data,
    }));
  }

  useEffect(() => {
    let receivedText = '';
    const receiveData = async () => {
      while (port?.readable) {
        const reader = port.readable.getReader();
        try {
          while (port) {
            const { value, done } = await reader.read();
            if (done) {
              return;
            }
            const text = new TextDecoder().decode(value);
            receivedText += text;
            if (!text.includes('\n')) continue;

            const lines = receivedText.split('\n');

            for (const line of lines) {

              if (!line.includes('\r')) continue;

              if (line.includes(':')) {
                const [key, value] = line.split(':').map(str => str.trim());
                const value_float = parseFloat(parseFloat(value).toFixed(4));
                if (!key || isNaN(value_float)) continue;

                const current = Date.now();
                setValues(prevValues => ({
                  ...prevValues,
                  [key]: prevValues[key]
                    ? {
                      ...prevValues[key],
                      max: prevValues[key].max > value_float ? prevValues[key].max : value_float,
                      min: prevValues[key].min < value_float ? prevValues[key].min : value_float,
                      now: value_float,
                      average: parseFloat((((prevValues[key].average * prevValues[key].count) + value_float) / (prevValues[key].count + 1)).toFixed(4)),
                      count: prevValues[key].count + 1,
                      hz: (current - prevValues[key].prevTime !== 0 ? parseFloat((1 / ((current - prevValues[key].prevTime) / 1000)).toFixed(0)) : prevValues[key].hz),
                      prevTime: current,
                    }
                    : {
                      active: false,
                      color: '#0345fc',
                      group: 0,
                      max: value_float,
                      min: value_float,
                      average: value_float,
                      now: value_float,
                      prevTime: Date.now(),
                      count: 1,
                      hz: 1,
                    },
                }));
              } else if (line.slice(0, 1) === "#") {
                setMessage(prev => [...prev, line.slice(1, line.length - 1)]);
              }
            }
            receivedText = lines[lines.length - 1];

          }
        } catch (error) {
          console.error(`Error reading data: ${error}`);
        } finally {
          reader.releaseLock();
        }
      }
    };
    receiveData();
  }, [port]);

  return (
    <div className='w-dvw overflow-hidden h-dvh'>
      <div className='flex flex-col md:flex-row h-auto md:h-full'>
        <div className='w-full md:w-1/2 h-full overflow-auto'>
          <Plotter data={values} disp={disp} disp_num={tabNum} />
        </div>
        <div className='w-full md:w-1/2 h-full overflow-auto'>
          <div className='h-56 m-2'>
            <ConnectionButton setPort={setPort} port={port} />
          </div>
          <div className="join grid grid-cols-3 m-4">
            <button className="join-item btn btn-outline" onClick={() => { setActiveTab(0) }}>Table</button>
            <button className="join-item btn btn-outline" onClick={() => { setActiveTab(1) }}>Message</button>
            <button className="join-item btn btn-outline" onClick={() => { setActiveTab(2) }}>Setting</button>
          </div>
          <div className="m-2">
            {activeTab === 0 && (
              <Table data={values} group={tabNum} setActive={setActive} setGroup={setGroup} setColor={setColor} />
            )}
            {activeTab === 1 && (
              <MessageDisp message={message} setMessage={setMessage} />
            )}
            {activeTab === 2 && (
              <Setting groups={tabNum} setGroups={setTabNum} disp={disp} setDisp={setDisp} />
            )}
          </div>
        </div>
      </div>
    </div >
  )
}

export default App
