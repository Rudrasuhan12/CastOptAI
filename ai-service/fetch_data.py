import pandas as pd
import requests
import io

def download_dataset():

    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/concrete/compressive/Concrete_Data.xls"
    
    print("Fetching dataset from UCI Repository...")
    try:
        response = requests.get(url)
        

        if response.status_code == 200:

            df = pd.read_excel(io.BytesIO(response.content))
            

            df.to_csv('concrete_data.csv', index=False)
            print("✅ Success: 'concrete_data.csv' is ready in the ai-service folder.")
        else:
            print(f"❌ Failed to download. Status code: {response.status_code}")
    except Exception as e:
        print(f"❌ An error occurred: {e}")

if __name__ == "__main__":
    download_dataset()