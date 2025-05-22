
from pydantic import BaseModel, ConfigDict
class HealthFlag(BaseModel):
    name:str
    model_config = ConfigDict(from_attributes=True)

    
class HealthFlagOut(BaseModel):
    user_id:int
    health_flag_id:int
    model_config = ConfigDict(from_attributes=True)

class UserHealthFlagOut(BaseModel):
    health_flag:HealthFlag
    model_config = ConfigDict(from_attributes=True)