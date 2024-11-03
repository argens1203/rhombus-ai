# %%

import pandas as pd
import numpy as np


def to_complex(l):
    def convert_one(x):
        try:
            return complex(x.replace("i", "j")) if "i" in str(x) else np.nan
        except:
            return np.nan

    return l.apply(convert_one)


def infer_and_convert_data_types(df):
    for col in df.columns:
        # int_count(df, col)
        if (
            df[col].apply(lambda x: str(x).lower() in ["true", "false"]).sum()
            / len(df[col].dropna())
            >= 0.6
        ):
            df[col] = df[col].astype(bool)
            continue

        if df[col].apply(lambda x: "i" in str(x)).mean() >= 0.6:
            df_converted = to_complex(df[col])
            if not df_converted.isna().all():
                df[col] = df_converted
                continue

        try:
            conv1 = pd.to_numeric(df[col], errors="coerce").astype("Int64")
            conv2 = pd.to_numeric(df[col], errors="coerce")
            if not conv1.isna().all() and not conv2.isna().all():
                if (conv2 - conv1).sum() != 0:
                    df[col] = conv2
                else:
                    df[col] = conv1
                continue
        except:
            pass

        # Attempt to convert to numeric first
        df_converted = pd.to_numeric(df[col], errors="coerce")
        if not df_converted.isna().all():  # If at least one value is numeric
            df[col] = df_converted
            continue

        # Attempt to convert to datetime
        try:
            df[col] = pd.to_datetime(df[col])
            continue
        except (ValueError, TypeError):
            pass

        # Check if the column should be categorical
        if (
            len(df[col].unique()) / len(df[col]) < 0.5
        ):  # Example threshold for categorization
            df[col] = pd.Categorical(df[col])

    return df


import requests

if __name__ == "__main__":
    url = "http://localhost:8000/api/users/parse_csv"
    with open("sample_data_2.csv", "rb") as f:
        files = {"file": ("sample_data_2.csv", f, "text/csv")}
        print(files)
        response = requests.post(url, files=files)

    # Test the function with your DataFrame
    # df = pd.read_csv("sample_data_2.csv")
    # print("Data types before inference:")
    # print(df.dtypes)

    # df = infer_and_convert_data_types(df)

    # print("\nData types after inference:")
    # print(df.dtypes)
    # print(df)

    # %%
