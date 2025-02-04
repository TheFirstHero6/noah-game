# Noah's Game in Next.js

## Overview

This project is a strategy game built using React.js and TypeScript, with a backend powered by Next.js and MongoDB. It is currently in its early stages, with no functionality implemented yet. The game will feature mechanics such as family trees, town and army management, trading, and strategic battles.

## Family Tree System

Family members play a crucial role in gaining an edge over opponents. They can:

- **Lead Armies** (age 18+)
- **Govern Regions** (age 18+)
- **Complete Missions** (age 18+)

### Marriages & Growth

Noble houses only allow marriages within their rank. There are two ways to obtain a spouse:

1. Search minor noble houses (cost: $1000 dowry) for a spouse.
2. Arrange a marriage with another player's character, involving a dowry and potential alliance.

Families grow through adoption or childbirth. Every four seasons, a roll determines if a married couple has children.

## Town & Population Management

Each town allows up to four buildings, requiring a population to maintain productivity. Population grows based on town size and can be allocated for:

1. **Armies** – Population is consumed when recruiting units.
2. **Buildings** – Higher-tier buildings require more population to operate.

### Upgrading System

- **Burgh & Building Levels** require resources (wood, stone, ducats) for upgrades.
- Various buildings produce essential resources such as food, wood, stone, horses, and firearms.

## Army & Combat System

Armies are composed of **Battalia** (units grouped together) and can be formed by multiple players.

### Recruitment Requirements:

- Must have a **Muster Field**.
- Pay the **population, resource, and ducat cost**.

### Unit Types & Stats

There are five main unit types: pikes, matchlocks, flintlocks, light cavalry, and heavy cavalry. Each unit has distinct combat stats including:

- **Hand-to-Hand Combat Ability**
- **Shooting Value**
- **Morale Save**
- **Stamina**

## Implementation Plan

### First Phase:

1. **User authentication and profiles**
2. **Basic resource tracking**
3. **Family tree visualization and management**

### Second Phase:

4. **Town management system**
5. **Building construction mechanics**
6. **Population management**

### Third Phase:

7. **Army recruitment and management**
8. **Combat system**
9. **Trading system between players**

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/game-project.git
   cd game-project
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Next.js server:
   ```sh
   npm run dev
   ```

## Contribution

Feel free to submit issues and pull requests to improve the project. Happy coding!

## License

MIT License
