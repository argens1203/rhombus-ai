import React, { ChangeEvent, useState } from 'react';

import axios from 'axios';
import { Container } from 'react-bootstrap';

import './App.css';
import { Data } from './components/data';
import { DragNdrop } from './components/drag-drop';
import { useAppDispatch, putType, putStuff } from './redux';
import { getDataApi, parseCsvApi } from './services/api';

function App() {
    const [file, setFile] = useState<File | null>(null);
    const dispatch = useAppDispatch();

    const getData = async () => {
        getDataApi().then((resp) => {
            console.log(resp.data);
            resp.data.forEach((item: { id: number } & Record<string, any>) => {
                dispatch(putStuff({ id: item.id, item }));
            });
        });
    };

    const onSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (!file) return;

        parseCsvApi(file)
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
                        <Data />
                    </div>
                </Container>
            </header>
        </div>
    );
}

export default App;
