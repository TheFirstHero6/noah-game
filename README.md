![logo](https://github.com/user-attachments/assets/e3f108ee-de71-4603-8138-6c903d570025)

# War of the Elector

A medieval fantasy strategy game built with Next.js, featuring noble house management, resource trading, and immersive theming.

## 🏰 Overview

War of the Elector is an online multiplayer strategy game where players manage noble families, oversee resources, and engage in diplomatic trade. Built with modern web technologies, the game features a rich medieval fantasy theme with customizable visual experiences.

**🌐 Live Demo:** [waroftheelector.space](https://waroftheelector.space)

## ✨ Latest Features (Recently Added)

### 🎨 **Dynamic Theme System** ⭐ _NEW_

Experience the realm in four distinct visual styles:

- **🏰 Royal Court** - Majestic golden halls with regal crimson banners and polished steel armor
- **🌲 Forest Kingdom** - Vibrant emerald forests with golden sunlight filtering through ancient trees
- **🔮 Mystical Wizard** - Enchanted purple mists with shimmering cyan magic and ethereal lavender glows
- **🐉 Dragon's Lair** - Blazing crimson flames with molten orange embers and deep volcanic shadows

_Screenshot placeholder: Theme selection interface showing all four theme options_

**Key Features:**

- **Persistent Theme Selection** - Your theme choice is saved to your profile
- **Seamless Switching** - Change themes instantly without page reload
- **Immersive Backgrounds** - Each theme features unique gradient patterns and atmospheric effects

### 💰 **Resource Trading System** ⭐ _NEW_

Engage in diplomatic resource exchange with other noble houses:

_Screenshot placeholder: Resource trading interface showing boon sending modal_

**Four Resource Types:**

- 🌲 **Wood** - For construction and crafting
- 🗿 **Stone** - For building and fortification
- 🍞 **Food** - For population sustenance
- 💰 **Ducats** - The realm's currency

**Trading Features:**

- **Boon Sending** - Send resources to other noble houses with validation
- **Real-time Validation** - Prevents insufficient resource transactions
- **Custom Notifications** - Themed success/error messages
- **Transaction History** - Track all resource movements

_Screenshot placeholder: Dashboard showing resource amounts and trading interface_

## 🛠️ Technology Stack

### **Frontend Development**

- **Next.js 14** - Full-stack React framework with App Router
- **TypeScript** - Type-safe development and better IDE support
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Custom Design System** - Medieval fantasy components with CSS variables

### **Backend & Database**

- **Next.js API Routes** - Serverless backend with TypeScript
- **Prisma ORM** - Type-safe database management and migrations
- **PostgreSQL** - Primary relational database
- **Neon** - Cloud PostgreSQL database hosting with connection pooling

### **Authentication & User Management**

- **Clerk** - Complete authentication solution with user management

### **Deployment & Hosting**

- **Vercel** - Serverless hosting and deployment platform
- **GitHub**

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ installed
- Git for version control
- PostgreSQL database (or Neon account)

### **Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/TheFirstHero6/noah-game.git
   cd noah-game
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file with:

   ```env
   DATABASE_URL="your_postgresql_connection_string"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   SIGNING_SECRET="your_clerk_signing_secret"
   ```

4. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎮 How to Play

### **Getting Started**

1. **Sign Up** - Create your noble house account at [waroftheelector.space](https://waroftheelector.space)
2. **Choose Your Theme** - Select from four medieval themes in Settings
3. **Explore the Dashboard** - View your resources and noble house
4. **Find Allies** - Search for other players in the realm
5. **Send Boons** - Trade resources with other noble houses

_Screenshot placeholder: User registration and first login experience_

### **Resource Management**

- **View Resources** - Check your current wood, stone, food, and ducats
- **Send Boons** - Transfer resources to other players with validation
- **Receive Resources** - Accept gifts from other noble houses
- **Track Transactions** - Monitor all resource movements

_Screenshot placeholder: Resource management dashboard with current amounts_

### **Theme Customization**

1. Navigate to **Settings** from the main menu
2. Choose your preferred theme from the four options
3. Click **Save Theme** to persist your choice
4. Enjoy your personalized medieval experience!

_Screenshot placeholder: Settings page showing theme selection interface_

## 🏗️ Development

### **Project Structure**

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── pages/             # Page components
│   └── globals.css        # Global styles with theme variables
├── components/            # Reusable components
├── contexts/              # React contexts (Theme management)
├── types/                 # TypeScript definitions
└── middleware.ts          # Clerk middleware
```

### **Key Components**

- **Dashboard** - Main game interface with resource display
- **Settings** - Theme selection and user preferences
- **Rules** - Game rules and information
- **Navbar** - Navigation with theme integration

### **API Endpoints**

- `/api/dashboard/user-data` - Consolidated user information
- `/api/dashboard/theme` - Theme management and persistence
- `/api/dashboard/transfering` - Resource transfers with validation
- `/api/dashboard/cleanup-names` - Admin name cleanup utilities

## 🎨 Customization

### **Adding New Themes**

1. Update `src/contexts/ThemeContext.tsx` with new theme type
2. Add CSS variables in `src/app/globals.css`
3. Update theme options in `src/app/pages/settings/page.tsx`
4. Add theme to Prisma schema if needed

### **Styling Guidelines**

- Use CSS variables for theme colors
- Follow the medieval fantasy design system
- Maintain responsive design principles
- Use Tailwind utility classes

## 🚀 Deployment

### **Production Deployment**

The live application is hosted at [waroftheelector.space](https://waroftheelector.space) using:

1. **Database Setup:**

   ```bash
   npx prisma migrate deploy
   ```

2. **Environment Variables:**
   Set up production environment variables in Vercel dashboard

3. **Build & Deploy:**
   ```bash
   npm run build
   ```

### **Database Management**

- **Migrations:** `npx prisma migrate dev`
- **Schema Push:** `npx prisma db push`
- **Generate Client:** `npx prisma generate`

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Roadmap

### **Upcoming Features**

- **Combat System** - Strategic battles between noble houses
- **Family Trees** - Noble lineage management
- **Town Building** - Construct and upgrade settlements
- **Diplomatic Relations** - Alliances and treaties
- **Seasonal Events** - Dynamic game events

### **Current Development Focus**

- Enhanced user experience
- Performance optimizations
- Mobile responsiveness
- Additional theme options

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues** - Report bugs and request features

---

**🌐 Play Now:** [waroftheelector.space](https://waroftheelector.space)
