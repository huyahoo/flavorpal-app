
from pydantic import BaseModel
class HealthFlag(BaseModel):
    name:str

    
class HealthFlagOut(BaseModel):
    user_id:int
    health_flag_id:int
    class Config:
        orm_mode = True

class UserHealthFlagOut(BaseModel):
    health_flag:HealthFlag
    class Config:
        orm_mode = True