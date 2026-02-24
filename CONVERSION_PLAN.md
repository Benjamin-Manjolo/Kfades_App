# Tailwind CSS Conversion Plan

## Project Analysis
- Project type: React + TypeScript booking application (barber shop)
- Current styling: MUI (Material-UI) with `sx` props + some Tailwind classes already present
- Tailwind CSS: Already installed and configured in the project

## Components to Convert
1. **App.tsx** - Remove MUI ThemeProvider, use Tailwind for base styling
2. **Welcome.tsx** - Convert Container, Paper, Typography, Button, Box to Tailwind
3. **ServiceCatalog.tsx** - Convert Grid, Card, Typography, Button, FormControl to Tailwind
4. **Calendar.tsx** - Convert Container, Typography, Grid, Button, Paper, Box to Tailwind
5. **BookingFlow.tsx** - Convert Stepper, TextField, Radio, Paper, Grid to Tailwind
6. **AdminLogin.tsx** - Convert Container, Paper, TextField, Button, Alert to Tailwind
7. **BarberInspo.tsx** - Convert Container, Grid, Card, Typography to Tailwind
8. **index.css** - Clean up base styles

## Conversion Strategy
- Replace MUI `sx` props with equivalent Tailwind utility classes
- Keep the component logic and structure intact
- Remove MUI components where possible and replace with native HTML + Tailwind
- Use @mui/material components only where functionality is complex (like Select, RadioGroup)

## Tailwind Classes Reference
- Container: `container mx-auto px-4`
- Paper/Card: `bg-white rounded-lg shadow-md p-6`
- Typography: `text-2xl font-bold`, `text-gray-600`, etc.
- Button: `bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700`
- Grid: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`
- Box (flex): `flex flex-col items-center justify-center`
- Form fields: `w-full px-3 py-2 border rounded-md`

## Implementation Order
1. Welcome.tsx - Simple component to start with
2. AdminLogin.tsx - Simple login form
3. ServiceCatalog.tsx - Service cards with grid
4. Calendar.tsx - Date/time selection
5. BookingFlow.tsx - Multi-step form
6. BarberInspo.tsx - Image gallery
7. App.tsx - Main layout
8. index.css - Base styles cleanup
