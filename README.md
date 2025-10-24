![logo](https://github.com/user-attachments/assets/e3f108ee-de71-4603-8138-6c903d570025)

# War of the Elector

A medieval fantasy strategy game built with Next.js, featuring city management, resource production, building construction, and turn-based economics based on the **Imperium Fragmentum (2nd Edition)** ruleset.

**🌐 Live Demo:** [waroftheelector.space](https://waroftheelector.space)

## 🏰 Overview

War of the Elector is an online multiplayer strategy game where players manage noble families, oversee cities, construct buildings, and engage in turn-based economics. Built with modern web technologies, the game features a rich medieval fantasy theme with customizable visual experiences and comprehensive city management systems.

## ✨ Core Game Features

### 🏘️ **City Management System** ⭐ _CORE FEATURE_

Manage your cities with comprehensive control over every aspect:

- **City Creation** - Admins can grant cities to players
- **City Upgrades** - Upgrade cities through 5 tiers with increasing costs and benefits
- **Tax Management** - Set flexible tax rates (0-100%) for each city
- **Local Wealth** - Cities maintain their own wealth pools separate from player resources
- **City Renaming** - Customize your cities with personalized names

_[Screenshot placeholder: City management interface showing city details, upgrade options, and tax controls]_

### 🏗️ **Building Construction & Upgrades** ⭐ _CORE FEATURE_

Construct and upgrade buildings to generate resources:

**Building Types:**

- **Sawmill** - Produces Wood (T1: 1, T2: 2, T3: 4 per turn)
- **Quarry** - Produces Stone (T1: 1, T2: 2, T3: 3 per turn)
- **Forge** - Produces Metal (T1: 1, T2: 2, T3: 3 per turn)
- **Farm** - Produces Food (T1: 2, T2: 4, T3: 6 per turn)
- **Market** - Produces Currency (T1: 5, T2: 10, T3: 15 per turn)

**Building System:**

- **Fixed Building Limit** - Each city can have exactly 4 buildings (regardless of tier)
- **Tier Upgrades** - Upgrade buildings from Tier 1 → 2 → 3 for increased production
- **Upgrade Costs** - T2: 50 currency, 20 wood, 10 stone | T3: 100 currency, 20 wood, 20 stone
- **Resource Production** - Buildings generate resources every turn based on their tier

_[Screenshot placeholder: Building construction interface showing available buildings, costs, and upgrade options]_

### 💰 **Turn-Based Economy** ⭐ _CORE FEATURE_

Experience a sophisticated economic system:

**Resource Types:**

- 🌲 **Wood** - For construction and building upgrades
- 🗿 **Stone** - For construction and building upgrades
- 🍞 **Food** - For population sustenance
- ⚔️ **Metal** - For advanced construction and weapons
- 🐄 **Livestock** - For trade and production
- 💰 **Currency** - The realm's primary currency (supports decimals)

**Economic Mechanics:**

- **Turn Advancement** - Admins advance turns to trigger resource generation
- **Building Production** - Each building generates resources based on its tier
- **City Income** - Cities generate Local Trade income based on their upgrade tier
- **Taxation System** - Players receive a percentage of city income based on tax rates
- **Local Wealth** - Cities retain untaxed income for future development

_[Screenshot placeholder: Turn advancement interface showing resource generation and city income calculations]_

### 🎨 **Dynamic Theme System** ⭐ _ENHANCED_

Experience the realm in four distinct visual styles:

- **🏰 Royal Court** - Majestic golden halls with regal crimson banners and polished steel armor
- **🌲 Forest Kingdom** - Vibrant emerald forests with golden sunlight filtering through ancient trees
- **🔮 Mystical Wizard** - Enchanted purple mists with shimmering cyan magic and ethereal lavender glows
- **🐉 Dragon's Lair** - Blazing crimson flames with molten orange embers and deep volcanic shadows

_[Screenshot placeholder: Theme selection interface showing all four theme options]_

### 💱 **Resource Trading System** ⭐ \_ENHANCED\*

Engage in diplomatic resource exchange with other noble houses:

**Trading Features:**

- **Boon Sending** - Send resources to other noble houses with validation
- **Real-time Validation** - Prevents insufficient resource transactions
- **Custom Notifications** - Themed success/error messages
- **Transaction History** - Track all resource movements
- **Decimal Currency Support** - Precise financial transactions

_[Screenshot placeholder: Resource trading interface showing transfer options and validation]_

### 👑 **Admin Panel** ⭐ \_ADMIN FEATURE\*

Comprehensive administrative tools for game management:

**Admin Functions:**

- **User Management** - View all players and their resources
- **City Granting** - Create and assign cities to players
- **Turn Advancement** - Trigger resource generation and city income
- **Resource Management** - Add/subtract resources for any player
- **Role Management** - Assign admin privileges

_[Screenshot placeholder: Admin panel interface showing user management and turn advancement controls]_

## 🎮 How to Play

### **Getting Started**

1. **Sign Up** - Create your noble house account at [waroftheelector.space](https://waroftheelector.space)
2. **Choose Your Theme** - Select from four medieval themes in Settings
3. **Explore the Dashboard** - View your resources and current status
4. **Request Cities** - Contact an admin to grant you your first city
5. **Start Building** - Construct buildings to generate resources

### **City Management**

1. **Access Your Cities** - Navigate to the Cities page to see all your settlements
2. **Manage City Details** - Rename cities and adjust tax rates
3. **Upgrade Cities** - Invest resources to increase city tiers and income
4. **Construct Buildings** - Build up to 4 buildings per city for resource production

### **Building Strategy**

1. **Plan Your Buildings** - Choose buildings that complement your strategy
2. **Upgrade Buildings** - Invest in tier upgrades for increased production
3. **Balance Resources** - Ensure you have the right mix of resource-generating buildings
4. **Maximize Efficiency** - Use all 4 building slots in each city

### **Economic Management**

1. **Monitor Resources** - Keep track of your resource stockpiles
2. **Set Tax Rates** - Balance between immediate income and city growth
3. **Trade Resources** - Exchange resources with other players
4. **Plan for Upgrades** - Save resources for city and building improvements

## 🛠️ Technology Stack

### **Frontend Development**

- **Next.js 14** - Full-stack React framework with App Router
- **TypeScript** - Type-safe development and better IDE support
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Custom Design System** - Medieval fantasy components with CSS variables

### **Backend & Database**

- **Next.js API Routes** - Serverless backend with TypeScript
- **Prisma ORM** - Type-safe database management and migrations
- **PostgreSQL** - Primary relational database with decimal support
- **Neon** - Cloud PostgreSQL database hosting with connection pooling

### **Authentication & User Management**

- **Clerk** - Complete authentication solution with user management
- **Role-based Access Control** - Admin and Basic user roles

### **Deployment & Hosting**

- **Vercel** - Serverless hosting and deployment platform
- **GitHub** - Version control and CI/CD

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ installed
- Git for version control
- PostgreSQL database (or Neon account)
- Clerk account for authentication

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

## 🏗️ Development

### **Project Structure**

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── admin/         # Admin panel APIs
│   │   ├── cities/        # City management APIs
│   │   └── dashboard/     # Dashboard APIs
│   ├── pages/             # Page components
│   │   ├── cities/        # City management pages
│   │   ├── admin/         # Admin panel
│   │   └── dashboard/     # Main dashboard
│   └── lib/               # Game configuration and utilities
├── components/            # Reusable components
├── contexts/              # React contexts (Theme management)
├── types/                 # TypeScript definitions
└── middleware.ts          # Clerk middleware
```

### **Key Components**

- **Dashboard** - Main game interface with resource display
- **Cities** - City management and building construction
- **Admin Panel** - Administrative tools and game management
- **Settings** - Theme selection and user preferences
- **Rules** - Game rules and information
- **Navbar** - Navigation with theme integration

### **API Endpoints**

**City Management:**

- `/api/cities` - Fetch user's cities
- `/api/cities/[id]` - Individual city management
- `/api/cities/[id]/build` - Building construction
- `/api/cities/[id]/upgrade` - City upgrades
- `/api/cities/[id]/buildings/[buildingId]/upgrade` - Building upgrades

**Admin Functions:**

- `/api/admin/users` - User management
- `/api/admin/cities` - City granting
- `/api/admin/advance-turn` - Turn advancement
- `/api/admin/resources` - Resource management

**Dashboard:**

- `/api/dashboard/user-data` - User information
- `/api/dashboard/resources` - Resource management
- `/api/dashboard/transfering` - Resource transfers

## 🎨 Game Rules (Imperium Fragmentum 2nd Edition)

### **City System**

- **City Tiers** - Cities can be upgraded from 1-5 with increasing costs and benefits
- **Local Trade Income** - T1: 10, T2: 15, T3: 40, T4: 55, T5: 70 currency per turn
- **Tax Rates** - Players can set any tax rate from 0-100% (overrides 5% increment rule)
- **Local Wealth** - Cities maintain separate wealth pools from player resources

### **Building System**

- **Building Limit** - Each city can have exactly 4 buildings (fixed, not tier-based)
- **Building Tiers** - Buildings can be upgraded from 1-3 for increased production
- **Production Rates** - Each building type has tier-based production rates
- **Upgrade Costs** - Standardized costs for building tier upgrades

### **Economic System**

- **Turn-based** - Resources generate when admin advances turns
- **Building Production** - Each building generates resources based on tier
- **City Income** - Cities generate Local Trade income based on tier
- **Taxation** - Players receive percentage of city income based on tax rate
- **Decimal Currency** - Supports precise financial calculations

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

### **Current Features**

- ✅ City management system
- ✅ Building construction and upgrades
- ✅ Turn-based economy
- ✅ Resource trading
- ✅ Admin panel
- ✅ Theme system

### **Upcoming Features**

- **Combat System** - Strategic battles between noble houses
- **Family Trees** - Noble lineage management
- **Diplomatic Relations** - Alliances and treaties
- **Seasonal Events** - Dynamic game events
- **Army Management** - Military unit recruitment and management

### **Current Development Focus**

- Enhanced user experience
- Performance optimizations
- Mobile responsiveness
- Additional building types
- Advanced economic features

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues** - Report bugs and request features

---

**🌐 Play Now:** [waroftheelector.space](https://waroftheelector.space)
