import React, { ChangeEvent, useState } from 'react';

import axios from 'axios';
import { Container } from 'react-bootstrap';
import { Rings } from 'react-loader-spinner';

import './App.css';
import { DragNdrop } from './components/drag-drop';
import { parseCsv, ItemTable } from './modules/item';
import { useIsLoading } from './modules/item/item.hook';
import { useAppDispatch } from './redux';

function App() {
    const [file, setFile] = useState<File | null>(null);
    const dispatch = useAppDispatch();
    const isLoading = useIsLoading();

    const onSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (!file) return;
        dispatch(parseCsv(file));
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
                        <ItemTable />
                    </div>
                    {isLoading && (
                        <Rings
                            visible
                            height="80"
                            width="80"
                            color="#4fa94d"
                            ariaLabel="rings-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    )}
                </Container>
            </header>
        </div>
    );
}

export default App;
