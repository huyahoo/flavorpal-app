from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class HealthFlag(BaseModel):
    name: str
    model_config = ConfigDict(from_attributes=True)


class HealthFlagOut(HealthFlag):
    
    healthFlagId: int
    model_config = ConfigDict(from_attributes=True)


class UserHealthFlagOut(BaseModel):
    healthFlag: Optional[List[HealthFlag]] = None
    model_config = ConfigDict(from_attributes=True)
