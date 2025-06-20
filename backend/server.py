from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models for Admin Panel
class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Participant(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    status: str = "Active"  # Active, Blocked
    registration_date: datetime = Field(default_factory=datetime.utcnow)
    location: str = ""
    bookings: int = 0

class Practitioner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    modality: str
    status: str = "Pending"  # Active, Blocked, Pending
    approval_status: str = "Pending"  # Approved, Rejected, Pending
    registration_date: datetime = Field(default_factory=datetime.utcnow)
    rating: float = 0.0
    classes: int = 0

class Modality(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    is_active: bool = True
    practitioner_count: int = 0

class GiftCard(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    value: float
    validity: int  # days
    usage_count: int = 0
    is_active: bool = True

class Class(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    practitioner: str
    date: str
    time: str
    mode: str  # In-Person, Online, Hybrid
    modality: str
    status: str = "Upcoming"  # Upcoming, Completed, Cancelled
    participants: int = 0
    is_hidden: bool = False

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    class_title: str
    participant: str
    practitioner: str
    date: str
    mode: str
    status: str = "Confirmed"  # Confirmed, Completed, Cancelled
    amount: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Basic API endpoints
@api_router.get("/")
async def root():
    return {"message": "Admin Panel API is running"}

@api_router.get("/status")
async def get_status():
    return {
        "status": "running",
        "timestamp": datetime.utcnow(),
        "service": "admin-panel-api"
    }

# Admin authentication endpoints
@api_router.post("/admin/login")
async def admin_login(email: str, password: str):
    # Mock authentication - in real app, verify against database
    if email == "admin@example.com" and password == "admin123":
        return {
            "success": True,
            "user": {
                "email": email,
                "name": "Admin User"
            },
            "token": "mock-jwt-token"
        }
    return {"success": False, "message": "Invalid credentials"}

@api_router.post("/admin/forgot-password")
async def forgot_password(email: str):
    # Mock forgot password - in real app, send email
    if email == "admin@example.com":
        return {"success": True, "message": "Reset link sent to email"}
    return {"success": False, "message": "Email not found"}

# Dashboard endpoints
@api_router.get("/dashboard/stats")
async def get_dashboard_stats():
    return {
        "total_practitioners": 25,
        "total_participants": 150,
        "total_bookings": 85,
        "monthly_revenue": 12450,
        "stats_change": {
            "practitioners": "+12%",
            "participants": "+18%", 
            "bookings": "+25%",
            "revenue": "+15%"
        }
    }

@api_router.get("/dashboard/revenue")
async def get_revenue_data(time_range: str = "month"):
    # Mock revenue data generation
    if time_range == "day":
        return {
            "labels": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
            "data": [250, 300, 275, 350, 400]
        }
    elif time_range == "week":
        return {
            "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
            "data": [1200, 1500, 1350, 1800]
        }
    else:  # month
        return {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "data": [4500, 5200, 4800, 6100, 5800, 6500]
        }

# Participants endpoints
@api_router.get("/participants", response_model=List[Participant])
async def get_participants():
    # Mock participants data
    return [
        {
            "id": "1",
            "name": "John Smith",
            "email": "john@email.com",
            "phone": "+1234567890",
            "status": "Active",
            "registration_date": "2024-01-15T00:00:00Z",
            "location": "New York",
            "bookings": 5
        },
        {
            "id": "2", 
            "name": "Sarah Johnson",
            "email": "sarah@email.com",
            "phone": "+1234567891",
            "status": "Active",
            "registration_date": "2024-02-20T00:00:00Z",
            "location": "Los Angeles",
            "bookings": 3
        }
    ]

@api_router.put("/participants/{participant_id}/status")
async def update_participant_status(participant_id: str, status: str):
    return {"success": True, "message": f"Participant {participant_id} status updated to {status}"}

# Practitioners endpoints
@api_router.get("/practitioners", response_model=List[Practitioner])
async def get_practitioners():
    # Mock practitioners data
    return [
        {
            "id": "1",
            "name": "Dr. Lisa Anderson",
            "email": "lisa@email.com",
            "modality": "Yoga",
            "status": "Active",
            "approval_status": "Approved",
            "registration_date": "2024-01-10T00:00:00Z",
            "rating": 4.8,
            "classes": 15
        },
        {
            "id": "2",
            "name": "Mark Thompson", 
            "email": "mark@email.com",
            "modality": "Sound Healing",
            "status": "Pending",
            "approval_status": "Pending",
            "registration_date": "2024-02-15T00:00:00Z",
            "rating": 0.0,
            "classes": 0
        }
    ]

@api_router.put("/practitioners/{practitioner_id}/approve")
async def approve_practitioner(practitioner_id: str):
    return {"success": True, "message": f"Practitioner {practitioner_id} approved"}

@api_router.put("/practitioners/{practitioner_id}/reject")
async def reject_practitioner(practitioner_id: str):
    return {"success": True, "message": f"Practitioner {practitioner_id} rejected"}

@api_router.put("/practitioners/{practitioner_id}/status")
async def update_practitioner_status(practitioner_id: str, status: str):
    return {"success": True, "message": f"Practitioner {practitioner_id} status updated to {status}"}

# Modalities endpoints
@api_router.get("/modalities", response_model=List[Modality])
async def get_modalities():
    return [
        {
            "id": "1",
            "name": "Yoga",
            "description": "Physical and mental practice",
            "is_active": True,
            "practitioner_count": 5
        },
        {
            "id": "2",
            "name": "Sound Healing",
            "description": "Healing through sound vibrations", 
            "is_active": True,
            "practitioner_count": 3
        }
    ]

@api_router.post("/modalities", response_model=Modality)
async def create_modality(modality: Modality):
    return modality

@api_router.put("/modalities/{modality_id}", response_model=Modality)
async def update_modality(modality_id: str, modality: Modality):
    return modality

@api_router.delete("/modalities/{modality_id}")
async def delete_modality(modality_id: str):
    return {"success": True, "message": f"Modality {modality_id} deleted"}

# Gift Cards endpoints
@api_router.get("/gift-cards", response_model=List[GiftCard])
async def get_gift_cards():
    return [
        {
            "id": "1",
            "name": "Wellness Starter",
            "value": 50,
            "validity": 365,
            "usage_count": 25,
            "is_active": True
        },
        {
            "id": "2",
            "name": "Premium Experience",
            "value": 100,
            "validity": 365,
            "usage_count": 15,
            "is_active": True
        }
    ]

@api_router.post("/gift-cards", response_model=GiftCard)
async def create_gift_card(gift_card: GiftCard):
    return gift_card

@api_router.put("/gift-cards/{card_id}", response_model=GiftCard)
async def update_gift_card(card_id: str, gift_card: GiftCard):
    return gift_card

@api_router.delete("/gift-cards/{card_id}")
async def delete_gift_card(card_id: str):
    return {"success": True, "message": f"Gift card {card_id} deleted"}

# Classes endpoints
@api_router.get("/classes", response_model=List[Class])
async def get_classes():
    return [
        {
            "id": "1",
            "title": "Morning Yoga Flow",
            "practitioner": "Dr. Lisa Anderson",
            "date": "2024-06-15",
            "time": "08:00",
            "mode": "In-Person",
            "modality": "Yoga",
            "status": "Upcoming",
            "participants": 15,
            "is_hidden": False
        }
    ]

@api_router.put("/classes/{class_id}/visibility")
async def toggle_class_visibility(class_id: str, is_hidden: bool):
    return {"success": True, "message": f"Class {class_id} visibility updated"}

# Bookings endpoints
@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    return [
        {
            "id": "1",
            "class_title": "Morning Yoga Flow",
            "participant": "John Smith",
            "practitioner": "Dr. Lisa Anderson",
            "date": "2024-06-15",
            "mode": "In-Person",
            "status": "Confirmed",
            "amount": 25.0,
            "created_at": "2024-06-10T00:00:00Z"
        }
    ]

# Revenue endpoints
@api_router.get("/revenue/analytics")
async def get_revenue_analytics(time_range: str = "month", modality: Optional[str] = None):
    return {
        "total_revenue": 45000,
        "average_revenue": 7500,
        "current_period": 8200,
        "growth_rate": "+15%",
        "by_modality": [
            {"name": "Yoga", "revenue": 15000, "bookings": 45},
            {"name": "Meditation", "revenue": 12000, "bookings": 38},
            {"name": "Sound Healing", "revenue": 8000, "bookings": 25}
        ]
    }

# Export endpoints
@api_router.get("/export/participants")
async def export_participants():
    return {"success": True, "message": "Participants exported successfully"}

@api_router.get("/export/practitioners")
async def export_practitioners():
    return {"success": True, "message": "Practitioners exported successfully"}

@api_router.get("/export/classes")
async def export_classes():
    return {"success": True, "message": "Classes exported successfully"}

@api_router.get("/export/bookings")
async def export_bookings():
    return {"success": True, "message": "Bookings exported successfully"}

@api_router.get("/export/revenue")
async def export_revenue():
    return {"success": True, "message": "Revenue data exported successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()