from fastapi import APIRouter, Depends, HTTPException
from typing import List
from .. import schemas, logic, auth
from ..data_manager import data_manager

router = APIRouter(prefix="/api/forecast", tags=["forecast"])

@router.get("/routes", response_model=List[str])
def get_routes():
    """Возвращает список уникальных маршрутов (MOW-AER, MOW-LED и т.д.)"""
    if data_manager.routes_df is None:
        raise HTTPException(status_code=500, detail="База данных маршрутов не загружена")
    
    routes = data_manager.routes_df['route'].unique().tolist()
    return routes

@router.post("/", response_model=schemas.ForecastResponse)
def get_forecast(
    request: schemas.ForecastRequest, 
    current_user: str = Depends(auth.get_current_user)
):
    """Считает прогноз продаж и отдает данные для графика"""
    try:
        return logic.calculate_forecast(request.route, request.date, request.price)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")