import React, { useEffect, useState, useRef } from 'react';

import { AiOutlineCloudUpload } from 'react-icons/ai';

import './drag-drop.css';

type Props = {
    onFilesSelected: (files: File | null) => void;
    width: number;
    height: number;
};

export function DragNdrop({ onFilesSelected, width, height }: Props) {
    const [file, setFiles] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = (event?.target?.files || []) as File[];
        if (selectedFiles && selectedFiles.length > 0) {
            setFiles(selectedFiles[0]);
        }
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles.length > 0) {
            setFiles(droppedFiles[0]);
        }
    };

    useEffect(() => {
        onFilesSelected(file);
    }, [file, onFilesSelected]);

    const onClick = () => {
        inputRef.current?.click();
    };

    return (
        <section className="drag-drop" style={{ width, height }}>
            <button className="drag-drop-btn" type="button" onClick={onClick}>
                <div
                    className={`document-uploader ${
                        file ? 'upload-box active' : 'upload-box'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(event) => event.preventDefault()}
                >
                    <div className="upload-info">
                        <AiOutlineCloudUpload />
                        <div>
                            <p>Drag and drop your csv here</p>
                        </div>
                    </div>
                </div>
            </button>
            <label htmlFor="browse">
                {/* Browse files */}
                <input
                    ref={inputRef}
                    type="file"
                    hidden
                    id="browse"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.pptx,.txt,.xlsx"
                    multiple
                />
            </label>

            {file && (
                // eslint-disable-next-line
                        <div
                    className="no-click"
                >
                    <div className="file-list">
                        <div className="file-list__container">
                            <div className="file-item" key={file.name}>
                                <div className="file-info">
                                    <p>{file.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
