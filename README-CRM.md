# Lead CRM Web Application

A fully functional Lead CRM built with React, TypeScript, Tailwind CSS, and Supabase. This application provides comprehensive lead management capabilities with a modern, responsive interface.

## Features

### 🎯 Core CRM Functionality
- **Lead Management**: Add, edit, delete, and view leads
- **Status Tracking**: New, Contacted, In Progress, Won, Lost
- **Team Assignment**: Assign leads to team members
- **Search & Filter**: Advanced filtering by status and search functionality
- **Export Data**: Download leads as CSV file

### 📊 Dashboard & Analytics
- **Sales Dashboard**: Overview of lead pipeline and conversion metrics
- **Status Breakdown**: Visual pipeline status distribution
- **Recent Activity**: Latest leads and updates
- **Performance Metrics**: Conversion rates and win statistics

### 🎨 Modern UI/UX
- **Professional Design**: Clean, business-focused interface
- **Responsive Layout**: Mobile-first design that works on all devices  
- **Status Indicators**: Color-coded lead status badges
- **Smooth Animations**: Professional transitions and hover effects

### ⚡ Technical Features
- **Real-time Updates**: Instant UI updates with Supabase integration
- **Form Validation**: Client-side validation with error handling
- **Toast Notifications**: User-friendly success/error messages
- **Loading States**: Proper loading indicators throughout the app

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, real-time subscriptions)
- **Routing**: React Router v6
- **State Management**: React hooks with custom useLeads hook
- **Form Handling**: Controlled components with validation
- **Date Handling**: date-fns for formatting

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### 1. Clone the Repository
```bash
git clone <repository-url>
cd lead-crm
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase Database

#### Create the Database Table
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the query to create the leads table and insert dummy data

The setup script will:
- Create the `leads` table with proper schema
- Add indexes for performance
- Insert 15 sample leads for testing
- Set up Row Level Security (RLS)
- Create auto-updating timestamp triggers

#### Database Schema
```sql
Table: leads
- id (UUID, Primary Key)
- name (VARCHAR, NOT NULL)
- email (VARCHAR, NOT NULL) 
- phone (VARCHAR, NOT NULL)
- status (VARCHAR, NOT NULL) - 'New'|'Contacted'|'In Progress'|'Won'|'Lost'
- assigned_to (VARCHAR, NOT NULL)
- created_at (TIMESTAMP, AUTO)
- updated_at (TIMESTAMP, AUTO)
```

### 4. Configure Supabase Connection

The application is already configured with your Supabase credentials:
- **URL**: `https://llkgrbmxpzdpqvazpxqv.supabase.co`
- **Anon Key**: Already included in the codebase

The connection is configured in `src/lib/supabase.ts`.

### 5. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Application Structure

```
src/
├── components/
│   ├── crm/
│   │   ├── CRMLayout.tsx        # Main layout with sidebar
│   │   ├── CRMSidebar.tsx       # Navigation sidebar
│   │   ├── LeadTable.tsx        # Data table with search/filter
│   │   ├── LeadForm.tsx         # Add/edit lead form
│   │   └── LeadStatusBadge.tsx  # Status indicator component
│   └── ui/                      # shadcn/ui components
├── hooks/
│   └── useLeads.ts              # Supabase operations hook
├── lib/
│   ├── supabase.ts              # Supabase client & types
│   └── utils.ts                 # Utility functions
├── pages/
│   ├── Dashboard.tsx            # Sales dashboard page
│   ├── Leads.tsx                # Lead list and management
│   ├── NewLead.tsx              # Add new lead page
│   └── NotFound.tsx             # 404 page
└── App.tsx                      # Main app with routing
```

## Key Features Explained

### Dashboard
- **Pipeline Overview**: Visual breakdown of leads by status
- **Key Metrics**: Total leads, conversion rate, recent activity
- **Quick Actions**: Add new lead, view recent leads
- **Responsive Cards**: Professional card layout with hover effects

### Lead Management
- **Comprehensive Table**: Sortable, searchable data table
- **Advanced Filtering**: Filter by status, search by name/email/phone
- **Bulk Actions**: Export filtered results to CSV
- **CRUD Operations**: Full create, read, update, delete functionality

### Form Handling
- **Validation**: Real-time form validation with error messages
- **Team Assignment**: Dropdown selection of team members
- **Status Management**: Easy status updates with visual indicators
- **Responsive Design**: Mobile-friendly form layouts

### Data Export
- **CSV Export**: Download filtered lead data
- **Comprehensive Fields**: All lead information included
- **Date Formatting**: Properly formatted timestamps

## Team Members

The application includes these predefined team members:
- John Doe
- Sarah Smith
- Mike Johnson
- Emily Brown  
- David Wilson

You can modify the team members list in `src/components/crm/LeadForm.tsx`.

## Customization

### Adding New Lead Statuses
1. Update the `LeadStatus` type in `src/lib/supabase.ts`
2. Add new status handling in `src/components/crm/LeadStatusBadge.tsx`
3. Update the database CHECK constraint if needed

### Styling Customization
The design system is defined in:
- `src/index.css` - CSS variables and theme colors
- `tailwind.config.ts` - Tailwind configuration with custom colors

### Adding New Fields
1. Update the database schema in Supabase
2. Modify the TypeScript interfaces in `src/lib/supabase.ts`
3. Update the form components and table columns

## Performance Considerations

- **Database Indexes**: Optimized queries with proper indexing
- **Component Optimization**: Efficient React patterns and hooks
- **Loading States**: Proper loading indicators for better UX
- **Error Handling**: Comprehensive error handling with user feedback

## Security Features

- **Row Level Security**: Enabled on the leads table
- **Input Validation**: Client-side and server-side validation
- **SQL Injection Protection**: Using Supabase's parameterized queries
- **XSS Prevention**: React's built-in XSS protection

## Deployment

### Deploy to Production

1. **Build the Application**
```bash
npm run build
```

2. **Deploy to Your Platform**
The built files will be in the `dist/` directory. You can deploy to:
- Vercel
- Netlify  
- AWS S3 + CloudFront
- Any static hosting service

3. **Environment Variables**
No environment variables needed - Supabase credentials are already configured.

## Development Workflow

### Adding New Features
1. Create feature branch
2. Implement changes following existing patterns
3. Test with dummy data
4. Update documentation if needed

### Common Operations
- **Add new page**: Create in `src/pages/` and add route in `App.tsx`
- **New component**: Follow existing component structure in `src/components/crm/`
- **Database changes**: Update schema in Supabase and TypeScript types

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify Supabase URL and anon key
   - Check if RLS policies are properly configured

2. **Build Errors**  
   - Ensure all dependencies are installed
   - Check TypeScript type errors

3. **Data Not Loading**
   - Verify the leads table exists and has data
   - Check browser console for errors

### Support
- Check the browser console for error messages
- Verify Supabase dashboard for database issues
- Ensure all npm dependencies are installed

## License

This project is open source and available under the MIT License.

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase.