"""
Standardized API response formats
"""
from typing import Any, Optional
from datetime import datetime


class APIResponse:
    """Standardized API response format"""
    
    @staticmethod
    def success(
        data: Any = None,
        message: str = "Success",
        status_code: int = 200
    ) -> dict:
        """Return success response"""
        return {
            "success": True,
            "message": message,
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
            "status_code": status_code
        }
    
    @staticmethod
    def error(
        message: str = "An error occurred",
        error_code: Optional[str] = None,
        details: Optional[Any] = None,
        status_code: int = 400
    ) -> dict:
        """Return error response"""
        return {
            "success": False,
            "message": message,
            "error_code": error_code,
            "details": details,
            "timestamp": datetime.utcnow().isoformat(),
            "status_code": status_code
        }
    
    @staticmethod
    def paginated(
        data: list,
        page: int,
        page_size: int,
        total: int,
        message: str = "Success"
    ) -> dict:
        """Return paginated response"""
        return {
            "success": True,
            "message": message,
            "data": data,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": (total + page_size - 1) // page_size,
                "has_next": page * page_size < total,
                "has_prev": page > 1
            },
            "timestamp": datetime.utcnow().isoformat()
        }


class StatusMessages:
    """Common status messages"""
    
    # Success messages
    CREATED = "Resource created successfully"
    UPDATED = "Resource updated successfully"
    DELETED = "Resource deleted successfully"
    RETRIEVED = "Resource retrieved successfully"
    
    # Auth messages
    LOGIN_SUCCESS = "Login successful"
    LOGOUT_SUCCESS = "Logout successful"
    SIGNUP_SUCCESS = "Account created successfully"
    TOKEN_REFRESHED = "Token refreshed successfully"
    
    # Error messages
    NOT_FOUND = "Resource not found"
    UNAUTHORIZED = "Unauthorized access"
    FORBIDDEN = "Access forbidden"
    VALIDATION_ERROR = "Validation error"
    SERVER_ERROR = "Internal server error"
    
    # Auth errors
    INVALID_CREDENTIALS = "Invalid email or password"
    EMAIL_EXISTS = "Email already registered"
    WEAK_PASSWORD = "Password does not meet security requirements"
    TOKEN_EXPIRED = "Token has expired"
    TOKEN_INVALID = "Invalid token"
