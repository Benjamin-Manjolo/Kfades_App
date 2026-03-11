# MVC Restructuring TODO

## Backend MVC Structure

### Phase 1: Setup & Configuration
- [x] 1.1 Create Backend/config/ directory and move supabase.js
- [x] 1.2 Update supabase.js import paths

### Phase 2: Models
- [x] 2.1 Create Backend/models/Booking.js - Booking schema/validation
- [x] 2.2 Create Backend/models/Service.js - Service schema

### Phase 3: Controllers
- [x] 3.1 Create Backend/controllers/bookingController.js - Extract booking logic from server.js
- [x] 3.2 Create Backend/controllers/paymentController.js - Extract payment logic from payment.js

### Phase 4: Routes
- [x] 4.1 Create Backend/routes/bookingRoutes.js - Booking route definitions
- [x] 4.2 Create Backend/routes/paymentRoutes.js - Payment route definitions

### Phase 5: Services
- [x] 5.1 Create Backend/services/paychanguService.js - External API calls

### Phase 6: Server Entry Point
- [x] 6.1 Refactor Backend/server.js to use new MVC structure
- [x] 6.2 Backend syntax validated - All files pass Node.js syntax check

## Frontend Service Layer (Optional Enhancement)

### Phase 7: Frontend Services
- [x] 7.1 Create src/services/bookingService.ts - API calls
- [x] 7.2 Create src/services/paymentService.ts - Payment API calls
- [ ] 7.3 Update components to use services (Optional - components still work with direct fetch)

---

## MVC Structure Complete!

### Backend Structure:
```
Backend/
├── config/
│   └── supabase.js           # Database configuration
├── controllers/
│   ├── bookingController.js  # Booking business logic
│   └── paymentController.js  # Payment business logic
├── models/
│   ├── Booking.js             # Booking schema/validation
│   └── Service.js             # Service schema
├── routes/
│   ├── bookingRoutes.js       # Booking route definitions
│   └── paymentRoutes.js       # Payment route definitions
├── services/
│   └── paychanguService.js    # External Paychangu API
├── server.js                  # Entry point (minimal)
└── package.json
```

### Frontend Structure:
```
src/
├── services/
│   ├── bookingService.ts      # Booking API calls
│   └── paymentService.ts      # Payment API calls
├── components/
├── types/
└── utils/
```

