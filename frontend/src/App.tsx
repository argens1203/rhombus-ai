import React, { ChangeEvent, useState } from 'react';

import axios from 'axios';

import './App.css';
import logo from './logo.svg';

function App() {
    const [file, setFile] = useState<File | null>();
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e?.target?.files;
        if (!files) return;
        setFile(files[0]);
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
            .then((resp) => console.log(resp.data))
            .catch((err) => console.error(err));
    };
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <input type="file" onChange={onChange} />
                <button type="submit" onClick={onSubmit}>
                    Upload
                </button>
            </header>
        </div>
    );
}

export default App;
