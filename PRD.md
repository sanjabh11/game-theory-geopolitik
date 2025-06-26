# PRD for Game Theory Geopolitical Platform

## Executive Summary

### Product Vision
To create the world's most advanced interactive platform that combines game theory education with real-time geopolitical prediction capabilities, empowering users to understand and forecast international relations through mathematical modeling and AI-driven insights.

### Product Mission
Enable students, researchers, policymakers, and analysts to master game theory concepts while accessing cutting-edge geopolitical predictions through an intuitive, AI-powered educational platform.

### Success Metrics
- **Educational**: 90% course completion rate, 85% assessment pass rate
- **Prediction**: 75% accuracy on 30-day geopolitical forecasts
- **Engagement**: 60% monthly active user retention
- **Performance**: <2s page load times, 99.9% uptime

---

## Core User Stories & LLM System Prompts

### User Story 1: Interactive Game Theory Tutorial
**As a** student new to game theory  
**I want to** learn fundamental concepts through interactive tutorials  
**So that** I can understand strategic decision-making in geopolitics

**Acceptance Criteria:**
- Progressive difficulty levels from basic to advanced
- Interactive Nash Equilibrium calculators
- Real-time feedback on strategic choices
- Visual game trees and payoff matrices


### User Story 2: Real-Time Geopolitical Risk Assessment
**As a** policy analyst  
**I want to** receive real-time geopolitical risk assessments  
**So that** I can make informed strategic recommendations

**Acceptance Criteria:**
- Live risk scoring (0-100) for global regions
- Multi-factor analysis (political, economic, military)
- Historical trend visualization
- Automated alert system for significant changes


---

## Architecture Overview

### Tech Stack
- **Backend**: Supabase (PostgreSQL + Real-time + Auth + Edge Functions)
- **LLM Integration**: Google Gemini 2.5 Pro API
- **Frontend Storage**: Browser LocalStorage + IndexedDB
- **Real-time**: Supabase Realtime subscriptions
- **Caching**: Browser Cache API + Local Storage

### Supabase Database Schema
```sql
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'student',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id),
    module_id TEXT NOT NULL,
    completion_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT NOW(),
    performance_data JSONB DEFAULT '{}'
);
```
This schema includes tables for user profiles, learning progress, risk assessments, and more, providing a comprehensive foundation for tracking user interactions and data-driven insights.
```

### Key Requirements 
- Progressive education and assessment 
- Real-time risk analyses
- Scenario simulations
- Multi-language sentiment integration

### Critical Information for Future Developers:
- Edge functions integrate Gemini LLM for risk assessments and learning modules.
- Ensure API keys are securely managed and not exposed.
- Supabase functions handle backend logic with high extensibility.

---

## How to Implement

### Frontend
- Implement with React using functional components and hooks.
- Style using TailwindCSS with a focus on responsive designs.

### Backend
- Deploy Supabase project with `supabase db push` and manage migrations.
- Use edge functions for actions requiring real-time processing and integration with Gemini LLM.
