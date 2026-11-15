import pandas as pd
from .config import settings

class DataManager:
    def __init__(self):
        self.forecast_df = None
        self.routes_df = None

    def load_data(self):
        try:
            self.forecast_df = pd.read_csv(settings.FORECAST_CSV_PATH)
            self.routes_df = pd.read_csv(settings.ROUTES_CSV_PATH)
            print("CSV files loaded successfully into memory.")
        except Exception as e:
            print(f"Error loading CSV files: {e}")

data_manager = DataManager()