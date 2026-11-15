from .data_manager import data_manager
from .schemas import ForecastResponse, QuantileData
from datetime import date

def calculate_forecast(route: str, req_date: date, user_price: float) -> ForecastResponse:
    route_info = data_manager.routes_df[data_manager.routes_df['route'] == route]
    if route_info.empty:
        raise ValueError("Маршрут не найден")
    
    base_price = route_info.iloc[0]['base_price']
    price_sensitivity = route_info.iloc[0]['price_sensitivity']

    date_str = req_date.isoformat()
    forecast_info = data_manager.forecast_df[
        (data_manager.forecast_df['route'] == route) & 
        (data_manager.forecast_df['date'] == date_str)
    ]

    
    if forecast_info.empty:
        raise ValueError("Прогноз на данную дату не найден")
    
    row = forecast_info.iloc[0]
    seats = int(row['seats'])

    quantiles = ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9']
    chart_data = []
    
    median_demand = 0
    median_sales = 0

    for q in quantiles:
        base_demand_col = f"{q}_base_demand"
        if base_demand_col not in row:
            continue
            
        q_base_demand = row[base_demand_col]
        
        demand = max(0,q_base_demand - price_sensitivity * (user_price - base_price))
        
        sales = min(seats, demand)
        
        demand_rounded = int(round(demand))
        sales_rounded = int(round(sales))
        
        chart_data.append(QuantileData(
            quantile=q,
            demand=demand_rounded,
            sales=sales_rounded
        ))
        if q == '0.5':
            median_demand = demand_rounded
            median_sales = sales_rounded

    return ForecastResponse(
        seats=seats,
        median_demand=median_demand,
        median_sales=median_sales,
        chart_data=chart_data
    )