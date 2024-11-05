import React, { ChangeEvent, useState } from 'react';

import axios from 'axios';
import { Container } from 'react-bootstrap';

import './App.css';
import { Data } from './components/data';
import { DragNdrop } from './components/drag-drop';
import logo from './logo.svg';
import { useAppDispatch, putType, putStuff } from './redux';

function App() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any>([]);
    const dispatch = useAppDispatch();
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e?.target?.files;
        if (!files) return;
        setFile(files[0]);
    };
    const getData = async () => {
        const url = 'http://localhost:8000/api/users';

        axios.get(url).then((resp) => {
            console.log(resp.data);
            resp.data.forEach((item: { id: number } & Record<string, any>) => {
                dispatch(putStuff({ id: item.id, item }));
            });
            // setData(resp.data);
        });
    };

    const onSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (!file) return;

        const url = 'http://localhost:8000/api/users/parse_csv';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        axios
            .post(url, formData, config)
            .then((resp) => {
                dispatch(putType(resp.data));
            })
            .then(getData)
            .catch((err) => console.error(err));
    };
    return (
        <div className="App">
            <header className="App-header">
                <Container
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: '100vh',
                        padding: 15,
                    }}
                >
                    <DragNdrop
                        onFilesSelected={setFile}
                        width={300}
                        height={300}
                    />
                    <button
                        className="btn-upload"
                        type="submit"
                        onClick={onSubmit}
                        disabled={!file}
                    >
                        Upload
                    </button>
                    <div style={{ flex: 1 }}>
                        <Data data={data} />
                    </div>
                    {/* <img src={logo} className="App-logo" alt="logo" /> */}

                    {/* <input type="file" onChange={onChange} /> */}
                </Container>
            </header>
        </div>
    );
}

export default App;
