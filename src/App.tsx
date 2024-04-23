import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import './App.css'
import ConnectionButton from './ConnectButton'
import Example from './Plotter'
import Table from './Table'
import Setting from './Setting'
import { INFINITY } from 'chart.js/helpers'

export interface Data {
  active: boolean,
  setActive: Dispatch<SetStateAction<boolean>>,
  group: number,
  setGroup: Dispatch<SetStateAction<number>>,
  data: number[],
  max: number,
  min: number,
  now: number,
  average: number,
  prevTime: number,
  hz: number,
};

interface PlotterProps {
  num: number;
  disp: number;
  data: { [key: string]: Data }
};

function Plotter(props: PlotterProps) {

  function Tab({ number }: { number: number }) {
    if (number === 0) {
      return (
        <>
          <input type="radio" role="tab" className="tab tab-active" aria-label={"Tab" + number.toString()} />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 w-full h-96">
            <Example />
          </div>
        </>
      );
    } else {
      return (
        <>
          <input type="radio" role="tab" className="tab" aria-label={"Tab" + number.toString()} />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 w-full h-dvh">
            <Example />
          </div>
        </>
      );
    }
  }

  function Stack() {
    return (
      <div className='grid w-full h-56'>
        <Example />
      </div>
    );
  }


  if (props.disp === 0) {
    return (
      <>
        <div className=''>
          <div>
            {Array.from({ length: props.num }).map((_, index) => (
              <Stack />
            ))}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div role="tablist" className="tabs tabs-lifted">
          {Array.from({ length: props.num }).map((_, index) => (
            <Tab number={index} />
          ))}
        </div>
      </>
    );
  }

}

function App() {

  const [port, setPort] = useState<SerialPort | undefined>();
  const [values, setValues] = useState<{ [key: string]: Data }>({});
  const [tabNum, setTabNum] = useState<number>(0);
  const [disp, setDisp] = useState<number>(0);

  useEffect(() => {
    console.log(values)
  }, [values]);

  useEffect(() => {
    let receivedText = '';
    const receiveData = async () => {
      while (port?.readable) {
        const reader = port.readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            const text = new TextDecoder().decode(value);
            receivedText += text;

            if (text.includes('\n')) {
              const lines = receivedText.split('\n');
              for (const line of lines) {
                if (line.includes(':')) {
                  const [key, value] = line.split(':').map(str => str.trim());
                  const value_float = parseFloat(value);
                  if (key && !isNaN(value_float)) {
                    const current = Date.now();
                    setValues(prevValues => ({
                      ...prevValues,
                      [key]: prevValues[key]
                        ? {
                          ...prevValues[key], data: [...prevValues[key].data, value_float],
                          max: prevValues[key].max > value_float ? prevValues[key].max : value_float,
                          min: prevValues[key].min < value_float ? prevValues[key].min : value_float,
                          now: value_float,
                          average: parseFloat((([...prevValues[key].data, value_float].reduce((a, b) => a + b, 0) / ([...prevValues[key].data, value_float].length)).toFixed(2))),
                          hz: (1 / ((current - prevValues[key].prevTime) / 1000) !== INFINITY ? parseFloat((1 / ((current - prevValues[key].prevTime) / 1000)).toFixed(1)) : prevValues[key].hz),
                          prevTime: current,
                        }
                        : {
                          active: true,
                          setActive: () => { },
                          group: 0,
                          setGroup: () => { },
                          data: [value_float],
                          max: value_float,
                          min: value_float,
                          average: value_float,
                          now: value_float,
                          prevTime: Date.now(),
                          hz: 60,
                        },
                    }));
                  }
                }
              }
              receivedText = lines[lines.length - 1];
            }

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
    <div className='container mx-auto w-dvw h-dvh'>
      <div className='grid grid-cols-2 gap-4 w-full h-full'>
        <div>
          <div className='grid'>
            <div className='w-full h-2/3 '>
              <Plotter data={values} num={tabNum} disp={disp} />
            </div>
          </div>
          <div className='grid '>
            <div className='w-full h-1/3'>
              <Setting groups={tabNum} setGroups={setTabNum} disp={disp} setDisp={setDisp}></Setting>
            </div>
          </div>
        </div>
        <div>
          <div className='w-full h-svh'>
            <div className='grid'>
              <ConnectionButton setPort={setPort} port={port} />
            </div>
            <div className='grid '>
              <Table data={values} group={tabNum} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
