![logo](https://github.com/user-attachments/assets/e3f108ee-de71-4603-8138-6c903d570025)
# War of the Elector in React and Next.js

## Overview

War of the Elector is an online multiplayer strategy game where players manage noble families, oversee towns, build armies, and engage in trade and combat. The game is currently in development, with core features being gradually implemented.

The latest version of the web app can be found at [waroftheelector.space](https://waroftheelector.space).

### **Core Gameplay Mechanics**

#### **Family Tree System**

Each player controls a noble house, where family members play a crucial role in gaining strategic advantages.

- **Family Roles:**
  - Lead armies (age 18+)
  - Govern regions (age 18+)
  - Complete missions (age 18+)
- **Marriages & Growth:**
  - Noble houses only marry within their rank.
  - Two ways to obtain a spouse:
    1. Pay \$1000 dowry to find a spouse from a minor noble house.
    2. Arrange a marriage with another player's noble family, with dowry negotiation and potential alliance benefits.
  - Families grow through adoption or childbirth, determined by seasonal rolls.

#### **Town & Population Management**

Towns serve as the economic backbone of a noble house.

- **Town Features:**
  - Each town can support up to four buildings.
  - Population is required for production and management.
- **Population Usage:**
  - **Armies:** Recruiting units consumes population.
  - **Buildings:** Higher-tier buildings require more workers.

#### **Upgrading System**

Players can enhance their towns and economy through resource-based upgrades.

- **Upgrade Requirements:**
  - Resources: Wood, stone, and ducats.
  - Buildings produce key resources: food, wood, stone, horses, and firearms.

#### **Army & Combat System**

Players can build armies and engage in strategic battles.

- **Recruitment Requirements:**
  - Must have a Muster Field.
  - Pay population, resource, and ducat costs.
- **Unit Types & Stats:**
  - **Pikes, Matchlocks, Flintlocks, Light Cavalry, Heavy Cavalry**
  - **Combat Stats:** Hand-to-hand ability, shooting value, morale save, stamina.

### **Development Roadmap**

#### **Current State**

- **User Authentication:** Implemented.
- **Database Syncing:** In development.
- **Version 1 (Upcoming Release):**
  - **Resource Management:** Ability to view, send, and receive resources and money.
  - **Future Updates:** Additional mechanics will be introduced in subsequent releases.

## **Tech Stack**

This game is built with:

- **React** (Frontend UI)
- **Next.js** (Full-stack framework)
- **Tailwind CSS** (Styling)
- **Prisma** (ORM for database interactions)
- **PostgreSQL** (Database)
- **Neon** (Cloud-based database hosting)

## **How to Download and Play**

To run War of the Elector locally:

### **Prerequisites**

Ensure that you have **Node.js** installed on your system.

### **Installation Steps**

1. Clone the repository:
   ```bash
   git clone https://github.com/TheFirstHero6/noah-game.git
   cd noah-game
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the game in your browser at `http://localhost:3000`

Stay tuned for updates and new features in upcoming releases!

