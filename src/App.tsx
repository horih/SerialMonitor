import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import './App.css'
import ConnectionButton from './ConnectButton'
import Example from './Plotter'
import Table from './Table'

interface Data {
  active: boolean,
  setActive: Dispatch<SetStateAction<boolean>>,
  group: number,
  setNumber: Dispatch<SetStateAction<boolean>>,
  data: number[],
  max: number,
  min: number,
  average: number,
  hz: number,
};

function App() {
  
  const [port, setPort] = useState<SerialPort | undefined>();
  const [values, setValues] = useState<{ [key: string]: Data }>({});
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
            if (text === '\n') {
              const [key, value] = receivedText.split(':').map(str => str.trim());

              const value_float = parseFloat(value);
              if (key && !isNaN(value_float)) {
                setValues(prevValues => ({
                  ...prevValues,
                  [key]: prevValues[key]
                    ? { ...prevValues[key], data: [...prevValues[key].data, value_float] }
                    : {
                      active: true,
                      setActive: () => { },
                      group: 0,
                      setNumber: () => { },
                      data: [value_float],
                      max: value_float,
                      min: value_float,
                      average: value_float,
                      hz: 0,
                    },
                }));
              }
            }
            receivedText = '';
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
  <div className='container w-dvw h-dvh'>
    <div className='grid grid-cols-2 gap-2 w-full h-full justify-stretch'>
      <div className='w-full h-dvh'>
        <Example />
      </div>
      <div className='grid w-full h-dvh '>
        <ConnectionButton setPort={setPort} port={port} />
        <Table />
      </div>
    </div>
  </div>
)
}

export default App
