import React, { useEffect, useState } from 'react';

import { AiOutlineCheckCircle, AiOutlineCloudUpload } from 'react-icons/ai';
import { MdClear } from 'react-icons/md';

import './drag-drop.css';

type Props = {
    onFilesSelected: (files: File | null) => void;
    width: number;
    height: number;
};

export function DragNdrop({ onFilesSelected, width, height }: Props) {
    const [file, setFiles] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = (event?.target?.files || []) as File[];
        if (selectedFiles && selectedFiles.length > 0) {
            setFiles(selectedFiles[0]);
            // const newFiles = Array.from(selectedFiles);
            // setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles.length > 0) {
            setFiles(droppedFiles[0]);
            // const newFiles = Array.from(droppedFiles);
            // setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleRemoveFile = () => {
        setFiles(null);
        // setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    useEffect(() => {
        onFilesSelected(file);
    }, [file, onFilesSelected]);

    return (
        <section className="drag-drop" style={{ width, height }}>
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
                        <p>Drag and drop your files here</p>
                        <p>
                            Limit 15MB per file. Supported files: .PDF, .DOCX,
                            .PPTX, .TXT, .XLSX
                        </p>
                    </div>
                </div>
                <label htmlFor="browse" className="browse-btn">
                    Browse files
                    <input
                        type="file"
                        hidden
                        id="browse"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.pptx,.txt,.xlsx"
                        multiple
                    />
                </label>

                {file && (
                    <div className="file-list">
                        <div className="file-list__container">
                            <div className="file-item" key={file.name}>
                                <div className="file-info">
                                    <p>{file.name}</p>
                                    {/* <p>{file.type}</p> */}
                                </div>
                                <div className="file-actions">
                                    <MdClear
                                        onClick={() => handleRemoveFile()}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {file && (
                    <div className="success-file">
                        <AiOutlineCheckCircle
                            style={{ color: '#6DC24B', marginRight: 1 }}
                        />
                        <p>File selected</p>
                    </div>
                )}
            </div>
        </section>
    );
}
