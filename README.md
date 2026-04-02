# Recipe App Starter

**Starter repository for Assignment 6**  
**COSC 498VI – Special Topics in Computer Science**  
**Spring 2026**  
**Dr. Roaa Soloh**

---

## Overview

This project is the starter version of the Recipe App that you will extend in Assignment 6.

The application already includes the core structure from the previous work, including:

- React + TypeScript project organization
- Supabase integration
- authentication-aware behavior
- category-based recipe handling
- favorites support
- public recipe dashboard behavior

In Assignment 6, you will continue from this starter and add new functionality related to **Supabase Storage**.

---

## Starter Repository Purpose

This repository is provided so that all of you begin from the same technical foundation.

You are not expected to rebuild the full application from zero.  
Instead, you are expected to continue from this codebase and implement the new required features for Assignment 6.

---

## Supabase Setup Requirement

For this assignment, each one should connect the project to their own Supabase setup.

This means you are expected to:

- create and configure your own Supabase project
- create the required database objects
- use your own environment variables
- test the application using your own backend configuration

---

## Project Structure

The project is organized as follows:

- `src/components` — reusable UI components
- `src/pages` — page-level views
- `src/hooks` — reusable React logic
- `src/services` — Supabase operations
- `src/types` — TypeScript types and interfaces
- `src/lib` — shared configuration such as the Supabase client

---

## Setup Instructions

### 1. Clone your repository
Clone your own fork of this starter repository.
```bash
git clone <your-repository-link>
cd recipe-app
```
### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

Create a file named `.env` in the project root. Use `.env.example` as a guide.

**Example:**

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

* **Important notes:** Do not commit your real `.env` file to version control. Keep your own project credentials private.

### 4. Create your Supabase database objects

Open your Supabase project and run the SQL inside `supabase-setup.sql` using the SQL Editor. 

This file prepares the required database tables, constraints, seed data, and Row Level Security (RLS) policies.

### 5. Start the project

```bash
npm run dev
```

---

## What Is Already Included

This starter already provides a working baseline for:

* Authentication flow
* Recipe display
* Category loading
* Favorites support
* Reusable component structure
* Organized hooks, services, and types

---

## What You Will Build in Assignment 6

In Assignment 6, you will extend this application with image and storage functionality using **Supabase Storage**. 

This means you will likely work on features such as:

* Recipe image upload
* Recipe image display
* Linking database records with stored image paths
* Ownership-aware image actions

**Likely files to update include:**

* `src/types/recipe.ts`
* `src/components/RecipeForm.tsx`
* `src/components/RecipeCard.tsx`
* `src/services/recipeService.ts`

**You may also create new files such as:**

* `src/services/storageService.ts`