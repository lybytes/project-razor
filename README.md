# Project Razor - Duolingo for Debate Skills and Critical Thinking

## AI has lost the war against disinformation - it's time for humans to fight back

Project Razor is the Duolingo for critical thinking - we train people to refute fallacious arguments and bad-faith debate tactics through gamification and bringing in real-life scenarios.




## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Auth & Database)

## Environment Variables

The app uses Supabase for authentication and database. Set these environment variables in your local `.env` file and in Vercel:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Setting up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/20250101000000_initial_schema.sql` to set up the database tables
3. Copy your project URL and anon key from the Supabase dashboard
4. Add them to your `.env` file (see `.env.example` for reference)
5. For Vercel deployment, add these variables in your project settings under Environment Variables


### Acknowledgements

The prototype for this app was initially built with Lovable !
**URL**: https://lovable.dev/projects/4d9055a3-be13-4b60-be8a-67c782154fd0


