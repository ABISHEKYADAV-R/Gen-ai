# CraftAI - AI-Powered Artisan Marketplace

CraftAI is a modern marketplace platform that empowers artisans to showcase and sell their handcrafted products using cutting-edge AI technology. The platform combines traditional craftsmanship with artificial intelligence to create compelling product stories, analyze materials, and enhance the overall shopping experience.

## 🌟 Features

### 🎨 **AI-Powered Product Listing**

- **Instant Image Analysis**: Upload product images and get automatic descriptions using Google Vision API
- **Material Detection**: AI identifies materials, craftsmanship techniques, and product categories
- **Smart Story Generation**: Gemini AI creates compelling product narratives based on artisan background and product details

### 🛍️ **Marketplace Experience**

- **Dynamic Product Pages**: Detailed product views with image galleries and artisan stories
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **User Authentication**: Secure login system with Firebase Authentication
- **Dashboard**: Comprehensive artisan dashboard for managing products and listings

### 🤖 **AI Integration**

- **Google Vision API**: Advanced image recognition and labeling
- **Gemini AI**: Natural language generation for product stories
- **Material Analysis**: Automated detection of craft materials and techniques
- **Price Recommendations**: AI-suggested pricing based on materials and craftsmanship

## 🚀 Live Demo

**Deployed on Vercel**: https://craft-gen.vercel.app/

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI APIs**: Google Vision API, Google Gemini AI
- **Deployment**: Vercel
- **Build Tool**: Turbopack

## 📁 Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── analyze-image/        # Image analysis endpoint
│   │   ├── detect-materials/     # Material detection endpoint
│   │   └── generate-story/       # Story generation endpoint
│   ├── dashboard/                # Artisan dashboard
│   ├── login/                    # Authentication page
│   ├── products/                 # Product listings
│   ├── product/[id]/            # Dynamic product pages
│   ├── story-builder/           # AI story builder
│   └── instant-product-listing/ # Quick product creation
├── components/                   # Reusable UI components
├── contexts/                     # React contexts (Auth, Toast)
├── backend/                      # Backend services
│   └── firebase/                # Firebase services
├── lib/                         # Utility functions
├── pages/api/                   # Legacy API routes
└── public/                      # Static assets
```

## 🔧 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Firebase project (for authentication and database)
- Google Cloud Platform account (for Vision and Gemini APIs)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ABISHEKYADAV-R/Gen-ai.git
   cd Gen-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

   # Google APIs
   GOOGLE_VISION_API_KEY=your_vision_api_key
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Configure Firebase**

   - Create a new Firebase project
   - Enable Authentication, Firestore, and Storage
   - Download the config and update `lib/firebase.js`

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Build for Production

```bash
npm run build
npm run start
```

## 📱 API Endpoints

### Image Analysis

- `POST /api/image-description` - Get AI-generated product descriptions
- `POST /api/analyze-image` - Comprehensive image analysis
- `POST /api/detect-materials` - Material and technique detection

### Story Generation

- `POST /api/generateStory` - Generate product stories using AI
- `POST /api/generate-story` - Alternative story generation endpoint

## 🎯 Key Pages

- **Homepage** (`/`) - Landing page with features showcase
- **Products** (`/products`) - Browse all products
- **Story Builder** (`/story-builder`) - AI-powered story creation
- **Dashboard** (`/dashboard`) - Artisan management panel
- **Instant Listing** (`/instant-product-listing`) - Quick product upload

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vercel** for seamless Next.js deployment
- **Firebase** for backend services
- **Google Cloud** for AI APIs
- **Tailwind CSS** for styling
- **Radix UI** for accessible components

## 📞 Support

For support, email [abisheking05@gmail.com] or create an issue in this repository.

---

**Built with ❤️ by [ABISHEKYADAV-R](https://github.com/ABISHEKYADAV-R) and [GOUTHAMAN A](https://github.com/Gouthaman11)**
