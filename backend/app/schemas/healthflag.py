from pydantic import BaseModel, ConfigDict


class HealthFlag(BaseModel):
    name: str
    model_config = ConfigDict(from_attributes=True)


class HealthFlagOut(HealthFlag):
    
    healthFlagId: int
    model_config = ConfigDict(from_attributes=True)


class UserHealthFlagOut(BaseModel):
    healthFlag: HealthFlag
    model_config = ConfigDict(from_attributes=True)
