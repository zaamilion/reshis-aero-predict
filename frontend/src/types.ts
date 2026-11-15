
export interface QuantileData {
    quantile: string;
    demand: number;
    sales: number;
}

export interface ForecastResponse {
    seats: number;
    median_demand: number;
    median_sales: number;
    chart_data: QuantileData[];
}