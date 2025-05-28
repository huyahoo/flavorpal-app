# backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    name: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)


class UserCreate(UserBase):
    healthFlags: Optional[List[str]] = [] 
    password: str
    model_config = ConfigDict(from_attributes=True)


class UserUpdate(UserBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    healthFlags: Optional[List[str]] = [] 
    model_config = ConfigDict(from_attributes=True)


class UserProfileOut(UserBase):
    id: int
    healthFlags: List[str] = []
    badges: List[str] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class UserBaseFrontend(BaseModel):
    name: Optional[str] = None

    class Config:
        orm_mode = True


class UserCreateFrontend(UserBaseFrontend):
    password: str
    healthFlags: Optional[List[str]] = []

    class Config:
        orm_mode = True


class UserUpdateFrontend(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    healthFlags: Optional[List[str]] = []
    class Config:
        orm_mode = True

class UserUpdateFrontendOut(UserUpdateFrontend):
    id: int
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class UserCreateFrontend(BaseModel):
    username: str
    email: EmailStr
    password: str
    healthFlags: Optional[List[str]] = []

    class Config:
        orm_mode = True


class UserCreateFrontendOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    healthFlags: List[str] = []
    class Config:
        orm_mode = True

class UserProfileFrontendOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    healthFlags: Optional[List[str]] = []
    badges: Optional[List[str]] = []
    class Config:
        orm_mode = True

class ScanStatistics(BaseModel):
    discoveredThisMonth:int
    totalScanned:int