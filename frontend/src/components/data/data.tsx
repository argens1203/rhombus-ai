import React from 'react';

type Props = {
    data: any[];
    type: Record<string, any>;
};

export function Data({ data, type }: Props) {
    console.log(data);
    console.log(type);
    return (
        data &&
        type && (
            <table>
                <thead>
                    {Object.keys(type).map((key: string) => (
                        <th>{key}</th>
                    ))}
                </thead>
                {data.map((d) => (
                    <tr>
                        {Object.values(d).map((val: any) => (
                            <td>{val}</td>
                        ))}
                    </tr>
                ))}
                <tbody />
            </table>
        )
    );
}
