# Supabase Setup for APIwidget

## Project Configuration

The APIwidget application uses Supabase for authentication, database, and storage. This document outlines the setup and configuration of our Supabase project.

### Project Details

- **Project Name**: apiwidget
- **Project ID**: cuvhqtyslazvbwlbhqcn
- **Region**: eu-central-1
- **Database URL**: https://cuvhqtyslazvbwlbhqcn.supabase.co

## Database Schema

The database schema consists of the following tables:

### 1. profiles

Extends the Supabase auth.users table with additional user information.

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 2. api_providers

Stores information about supported API providers.

```sql
CREATE TABLE public.api_providers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 3. api_keys

Stores API keys for different providers.

```sql
CREATE TABLE public.api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider_id INTEGER REFERENCES public.api_providers NOT NULL,
  key_name TEXT NOT NULL,
  key_value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, provider_id, key_name)
);
```

### 4. api_usage

Tracks API usage data.

```sql
CREATE TABLE public.api_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider_id INTEGER REFERENCES public.api_providers NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  cost DECIMAL(10, 4) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, provider_id, date)
);
```

### 5. user_settings

Stores user preferences and settings.

```sql
CREATE TABLE public.user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  widget_position JSONB DEFAULT '{"x": 20, "y": 20}'::jsonb,
  widget_size TEXT DEFAULT 'medium',
  widget_theme TEXT DEFAULT 'dark',
  active_provider TEXT,
  show_widget BOOLEAN DEFAULT true,
  auto_start BOOLEAN DEFAULT false,
  alert_thresholds JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Row Level Security (RLS) Policies

All tables have Row Level Security enabled to ensure users can only access their own data:

- **profiles**: Users can only view and update their own profile
- **api_keys**: Users can only CRUD their own API keys
- **api_usage**: Users can only view their own usage data
- **user_settings**: Users can only CRUD their own settings

## Authentication Configuration

- **Site URL**: http://localhost:5173
- **Signup**: Enabled
- **Email Auth**: Enabled
- **External OAuth Providers**: None currently enabled

## Default Data

The database is pre-populated with the following API providers:

1. **OpenAI**
   - Slug: openai
   - Color: #10a37f

2. **GitHub**
   - Slug: github
   - Color: #24292e

3. **AWS**
   - Slug: aws
   - Color: #ff9900

## Environment Variables

To connect to the Supabase project, the following environment variables are required:

```
VITE_SUPABASE_URL=https://cuvhqtyslazvbwlbhqcn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Automatic User Setup

When a new user signs up, the following happens automatically:

1. A new profile record is created
2. Default user settings are created

This is handled by a database trigger on the auth.users table.

## API Access

The application uses the Supabase JavaScript client to interact with the database and authentication services. The client is initialized with the URL and anonymous key from environment variables.

## Security Considerations

- API keys are stored in the database but should be encrypted before storage
- The service role key should never be exposed in client-side code
- All database access should go through RLS policies
- Sensitive operations should use server-side functions when possible
