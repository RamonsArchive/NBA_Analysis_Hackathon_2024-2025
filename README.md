# 🏀 NBA Legend Finder

A comprehensive Next.js web application that combines NBA player data analysis with interactive gaming features. This project demonstrates full-stack development skills, data processing, and modern UI/UX design.

## ✨ Features

### 🔍 **Find Your Legend** - Player Recommendation System

- **Smart Player Matching**: Input your budget, height preferences, age range, and position
- **Advanced Filtering**: Automatically filters NBA players based on your criteria
- **Intelligent Scoring**: Uses weighted algorithms to rank players by performance metrics
- **Top 5 Recommendations**: Get the best matches with detailed player statistics
- **Real-time Results**: Instant recommendations with beautiful data visualization

### 🎯 **Guess Your Legend** - Interactive NBA Guessing Game

- **AI-Powered Questions**: The app asks intelligent questions to guess your player
- **Conference Selection**: Choose between Eastern and Western Conference
- **Dynamic Filtering**: Questions adapt based on remaining player pool
- **Performance Tracking**: Monitor questions asked and players remaining
- **Game Log**: Complete history of the guessing process
- **Smart Algorithms**: Optimized question selection for efficient player identification

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Data Processing**: CSV parsing, data merging, and validation
- **State Management**: React hooks and server actions
- **Data Sources**: NBA API integration and salary databases
- **Deployment**: Vercel-ready with optimized build process

## 📊 Data Integration

### **Player Statistics**

- **Performance Metrics**: Points, assists, rebounds, steals, blocks per game
- **Physical Attributes**: Height, weight, age, position
- **Team Information**: Current team and conference
- **Awards & Recognition**: Career achievements and honors

### **Salary Information**

- **Multi-Year Data**: 2023-2025 salary information
- **Smart Fallbacks**: Automatic fallback to available salary years
- **Currency Handling**: Proper formatting and validation
- **Budget Matching**: Efficient salary-based filtering

### **Data Processing Pipeline**

1. **Raw Data Collection**: NBA API integration for player statistics
2. **Data Merging**: Combines stats and salary information
3. **Validation & Cleaning**: Ensures data integrity and consistency
4. **Real-time Processing**: Dynamic filtering and scoring algorithms

## 🎮 How It Works

### **Player Recommendation Engine**

1. **Input Validation**: Form validation with Zod schema
2. **Data Filtering**: Multi-criteria player selection
3. **Scoring Algorithm**: Weighted performance metrics
4. **Result Ranking**: Top 5 players with detailed stats

### **Guessing Game Logic**

1. **Conference Selection**: Narrow down player pool
2. **Intelligent Questioning**: Algorithm-driven question selection
3. **Dynamic Filtering**: Real-time player pool reduction
4. **Result Prediction**: Accurate player identification

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+
- npm or yarn

### **Installation**

```bash
# Clone the repository
git clone [your-repo-url]
cd my-project

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### **Environment Setup**

- No environment variables required
- Uses public CSV data files
- Ready for immediate deployment

## 📁 Project Structure

```
my-project/
├── app/                    # Next.js app directory
│   ├── api/               # API routes for data processing
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── HomeContent.tsx    # Main navigation and content
│   ├── ReviewForm.tsx     # Player recommendation form
│   ├── GuessYourLegend.tsx # Interactive guessing game
│   ├── ViewResults.tsx    # Results display component
│   └── Navbar.tsx         # Navigation header
├── lib/                   # Utility functions and types
│   ├── actions.ts         # Server actions for data processing
│   ├── GlobalTypes.ts     # TypeScript type definitions
│   ├── validation.ts      # Form validation schemas
│   └── utils.ts           # Helper functions
├── data/                  # CSV data files
├── public/                # Static assets
└── tailwind.config.ts     # Tailwind CSS configuration
```

## 🎨 Design Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Color Scheme**: Professional blue/purple gradient theme
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: Proper contrast, focus states, and semantic HTML

## 🔧 Key Algorithms

### **Player Scoring System**

```typescript
Score = (Points × 0.5) + (Rebounds × 0.25) + (Assists × 0.15) +
        (Steals × 0.05) + (Blocks × 0.05)
```

### **Position Matching**

- **Exact Matches**: Direct position alignment
- **Hybrid Positions**: Support for Guard-Forward, Forward-Center
- **Flexible Matching**: Intelligent position recognition

### **Question Optimization**

- **Balance Analysis**: Minimizes player pool imbalance
- **Efficient Filtering**: Reduces questions needed for identification
- **Smart Fallbacks**: Handles edge cases gracefully

## 🚀 Deployment

### **Vercel (Recommended)**

- **Automatic Detection**: Vercel recognizes Next.js automatically
- **Zero Configuration**: Deploy with GitHub integration
- **Performance**: Global CDN and automatic optimization
- **Free Tier**: Generous free hosting for personal projects

### **Build Process**

```bash
npm run build    # Creates optimized production build
npm run start    # Starts production server
```

## 📈 Performance Features

- **Server-Side Rendering**: Fast initial page loads
- **Optimized Data Processing**: Efficient CSV parsing and filtering
- **Smart Caching**: Reduces redundant data processing
- **Responsive Images**: Optimized for all device sizes
- **Code Splitting**: Automatic bundle optimization

## 🎯 Use Cases

- **NBA Fans**: Discover players matching specific criteria
- **Fantasy Sports**: Research player statistics and salaries
- **Data Analysis**: Explore NBA player performance metrics
- **Interactive Gaming**: Challenge friends with the guessing game
- **Portfolio Project**: Showcase full-stack development skills

## 🔮 Future Enhancements

- **Player Comparisons**: Side-by-side player analysis
- **Historical Data**: Multi-season performance tracking
- **Advanced Analytics**: Machine learning-based predictions
- **Social Features**: Share results and challenge friends
- **Mobile App**: React Native version for mobile devices

## 👨‍💻 Development

### **Code Quality**

- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic code formatting
- **Component Architecture**: Reusable, maintainable components

### **Testing Strategy**

- **Component Testing**: React component validation
- **API Testing**: Endpoint functionality verification
- **Data Validation**: CSV processing accuracy
- **User Experience**: Interactive feature testing

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**
