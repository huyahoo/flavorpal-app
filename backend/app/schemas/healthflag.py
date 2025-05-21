
from pydantic import BaseModel
class HealthFlag(BaseModel):
    id:int
    name:str
    
class HealthFlagOut(HealthFlag):
    pass
    class Config:
        orm_mode = True
