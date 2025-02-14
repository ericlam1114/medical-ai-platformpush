# Medical AI Platform

A modern web platform that helps healthcare professionals leverage AI in their medical workflows. Built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🔐 Secure Authentication with Supabase
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully Responsive Design
- ⚡ Fast Page Loads with Next.js
- 🛡️ Protected Routes
- 🔄 Real-time Updates

## Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [Supabase](https://supabase.com/) - Backend and Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React](https://reactjs.org/) - UI Library

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/medical-ai-platform.git
cd medical-ai-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anonymous key

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
