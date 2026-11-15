from pydantic import BaseModel, EmailStr
from typing import List
from datetime import date
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


class ForecastRequest(BaseModel):
    route: str
    date: date
    price: float

class QuantileData(BaseModel):
    quantile: str
    demand: int
    sales: int

class ForecastResponse(BaseModel):
    seats: int
    median_demand: int
    median_sales: int
    chart_data: List[QuantileData]