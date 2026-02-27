import pandas as pd
import numpy as np

def preprocess_data():
    print("Reading raw concrete data...")

    df = pd.read_csv('concrete_data.csv')


    df.columns = [
        'cement', 'slag', 'fly_ash', 'water', 'superplasticizer', 
        'coarse_agg', 'fine_agg', 'age_days', 'strength'
    ]


    df['age_hours'] = df['age_days'] * 24


    np.random.seed(42)
    num_rows = len(df)


    df['temperature'] = np.random.uniform(5, 45, size=num_rows)


    df['humidity'] = np.random.uniform(20, 90, size=num_rows)


    df['curing_method'] = np.random.choice([0, 1, 2], size=num_rows, p=[0.7, 0.2, 0.1])


    output_file = 'processed_concrete_data.csv'
    df.to_csv(output_file, index=False)
    
    print(f"✅ Success: '{output_file}' created!")
    print(f"New Columns: {list(df.columns)}")

if __name__ == "__main__":
    preprocess_data()