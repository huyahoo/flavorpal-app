from pydantic import BaseModel
class HealthFlagBase(BaseModel):
    name:str
class HealthFlagOut(HealthFlagBase):
    id:int
    class Config:
        orm_mode = True
