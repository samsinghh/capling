# Onboarding Flow

## Overview
When users sign up for Capling, they now go through a guided onboarding process that collects their weekly budget and financial goals.

## Features

### Step 1: Weekly Budget
- Users set their weekly spending budget
- Visual guidance with budget ranges (Conservative: $100-150, Moderate: $150-250, Comfortable: $250+)
- Required field to proceed

### Step 2: Financial Goals (Optional)
- Users can add multiple financial goals
- Each goal includes:
  - Title (e.g., "Vacation to Europe")
  - Target amount
  - Category (Travel, Emergency Fund, Education, etc.)
  - Emoji for visual appeal
- Goals are stored in the `goals` table
- Users can skip this step if they don't want to set goals initially

## Technical Implementation

### Components
- `OnboardingForm` - Main onboarding component with step-by-step flow
- `AuthContext` - Manages onboarding state and completion

### Database Changes
- `user_profiles.weekly_budget` - Stores the user's weekly budget
- `goals` table - Stores user's financial goals with categories and emojis

### Flow Logic
1. User signs up successfully
2. System checks if user has a `weekly_budget` set in their profile
3. If no budget is set, `needsOnboarding` is set to `true`
4. Onboarding form is displayed instead of the main app
5. User completes onboarding (budget + optional goals)
6. `needsOnboarding` is set to `false`
7. User is redirected to the main app

### Goal Categories
- General 🎯
- Travel ✈️
- Emergency Fund 🆘
- Education 📚
- Home 🏠
- Car 🚗
- Health 💊
- Entertainment 🎬

## Testing
1. Sign up with a new email
2. You should see the onboarding form
3. Set a weekly budget (required)
4. Optionally add some goals
5. Complete setup
6. You should be redirected to the main app

## Future Enhancements
- Add more goal categories
- Allow editing of budget and goals after onboarding
- Add progress tracking for goals
- Include spending category preferences
- Add income level selection for better recommendations
