
# ขายอะไรดีวะ — Phase 1 Plan

## Overview
Build a mobile-first Thai-language web app with a polished landing page and the first 2 interactive steps, using local storage for data persistence. All UI in Thai with a friendly, playful tone ("เพื่อนที่รู้เยอะกว่า").

## Design System
- **Colors:** Warm, encouraging palette — deep indigo primary, soft cream/white backgrounds, golden accent for CTAs
- **Typography:** Clean, modern Thai-friendly fonts (system Thai + Inter)
- **Style:** Rounded corners, generous spacing, card-based layouts, mobile-first

---

## Pages to Build

### 1. Landing Page (`/`)
- **Hero:** Bold headline "คนอื่นสอนยิง Ads... แต่ถ้ายังไม่รู้จะขายอะไรดีวะ ระบบนี้คือคำตอบ" with CTA button
- **Problem section:** Pain points (รู้ว่าต้องทำ แต่คิดไม่ออก, AI Layoff context)
- **Solution section:** "การข้ามขั้น" concept, Gold Rush Principle explanation
- **5 Steps overview:** Visual step cards showing the full system flow
- **Persona highlights:** Cards for ปอน, แอน, โจ้ with relatable descriptions
- **Pricing table:** 3-tier comparison (Starter/Pro/Community) with LINE OA CTA buttons
- **FAQ section:** Accordion-style common questions
- **Footer:** Navigation links, contact info

### 2. Step 1: ขายอะไรดี? — Idea Extraction (`/step/1`)
- **Header:** Step indicator (1/5) with progress bar
- **7 question form:** Text inputs for the 7 brainstorming questions (e.g., "ความรู้อะไรที่คนเคยมาถามคุณซ้ำๆ?")
- **Scoring matrix:** Interactive table where users score ideas on demand, competition, skill, time — auto-calculates totals with visual highlighting of top idea
- **Examples section:** Cards showing skill → product mapping (Designer → Template Pack, etc.)
- **AI prompt section:** Pre-written prompt in a copyable text area with copy-to-clipboard button
- **Output:** Display top 1-3 product ideas with target audiences based on scoring
- **Links to Google Docs/Sheets templates** for saving their results externally
- **Save to local storage** and "ไปขั้นตอนต่อไป" button

### 3. Step 2: ทำยังไง? — Product Creation (`/step/2`)
- **Header:** Step indicator (2/5) with progress bar
- **Product type selector:** 3 visual cards (Ebook/Guide, Template Pack, Mini Course)
- **Dynamic forms based on selection:**
  - **Ebook:** Chapter-by-chapter input fields following the template structure
  - **Template Pack:** Checklist of required elements, file structure input, pricing suggestions
  - **Mini Course:** 5-module structure inputs, script template, free tools list (Loom, Canva, OBS)
- **Canva template links:** Buttons linking to cover/layout templates (open in new tabs)
- **AI prompt section:** Copyable prompts for content generation
- **Links to Google Docs templates** for the actual product creation
- **Save to local storage** and completion confirmation

### 4. Simple Dashboard (`/dashboard`)
- **Progress tracker:** Visual step indicators showing completion (steps 1-2 active, 3-5 locked/coming soon)
- **Quick links** to each step with status badges
- **Output history:** Links to any Google Docs/Sheets templates from completed steps
- **"Coming soon" cards** for Steps 3-5

## Data & Storage
- All user inputs saved to `localStorage` per step
- Data persists across sessions on the same device
- No authentication required

## Key Interactions
- Smooth scroll on landing page CTAs
- Real-time score calculation in Step 1 matrix
- Dynamic form switching in Step 2 based on product type
- Copy-to-clipboard for AI prompts with toast confirmation
- Progress auto-saves on input change
- All external links (Google Docs, Canva) open in new tabs
