# 🍔 TastyRide Backend

TastyRide is a multi-vendor food delivery platform connecting users with restaurants. The backend handles authentication, order management, payments, and more.

## 🚀 API Endpoints  

### **🟢 Authentication**
| Method | Endpoint        | Description           |
|--------|----------------|-----------------------|
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | User login (JWT)   |
| `GET`  | `/auth/me` | Get logged-in user   |

### **🟢 Food**
| Method | Endpoint        | Description           |
|--------|----------------|-----------------------|
| `POST` | `/api/foods` | Add Foods |
| `GET` | `/api/foods` | Get All Foods   |