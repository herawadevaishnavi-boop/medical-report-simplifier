# Medical Report Simplifier

An intelligent app that scans medical reports and simplifies complex medical terminology into easy-to-understand language with detailed explanations.

## 🎯 Features

- 📄 **Multi-format Support**: Upload PDF, images, or text medical reports
- 🔍 **OCR Technology**: Automatic text extraction from images and PDFs
- 🤖 **AI-Powered Simplification**: Uses GPT-4 to convert medical jargon to simple language
- 📚 **Medical Glossary**: Explains medical terms and findings
- 💾 **Report History**: Save and access previous reports
- 📱 **Responsive Design**: Works on web and mobile devices
- 🎨 **User-Friendly Interface**: Clean, intuitive UI for all users

## 🛠 Tech Stack

### Frontend
- React.js with Hooks
- Tailwind CSS for styling
- Redux Toolkit for state management
- Axios for API requests
- React Router for navigation

### Backend
- Node.js + Express
- Tesseract.js for OCR
- OpenAI GPT-4 API for AI simplification
- MongoDB for data storage
- JWT for authentication
- Multer for file uploads

### Additional Libraries
- Sharp for image processing
- PDF.js for PDF text extraction
- React Dropzone for file uploads
- React Toastify for notifications

## 📁 Project Structure

```
medical-report-simplifier/
├── backend/                      # Express backend
│   ├── src/
│   │   ├── config/              # Database & API configs
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Custom middleware
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   └── server.js            # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API services
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── .env.example
│   └── tailwind.config.js
│
├── docs/                        # Documentation
│   ├── API.md
│   ├── SETUP.md
│   └── DEPLOYMENT.md
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- OpenAI API Key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Visit `http://localhost:3000` in your browser.

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/medical-simplifier
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=10485760
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_VERSION=1.0.0
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Reports
- `POST /api/reports/upload` - Upload a medical report
- `GET /api/reports` - List all user reports
- `GET /api/reports/:id` - Get report details
- `DELETE /api/reports/:id` - Delete a report
- `POST /api/reports/:id/simplify` - Simplify a report

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/change-password` - Change password

## 💡 How to Use

1. **Create Account**: Sign up with email and password
2. **Upload Report**: Upload a PDF, image, or text file of your medical report
3. **Extract Text**: OCR automatically extracts text from the document
4. **Simplify**: Click "Simplify" to convert medical jargon to simple language
5. **View Results**: See:
   - Simplified report in plain English
   - Key findings explained
   - Medical terms with definitions
6. **Save & Reference**: Access all your reports anytime

## 🎓 Features Explained

### OCR Technology
- Extracts text from PDFs and images
- Supports high-resolution scans
- Handles multiple pages

### AI Simplification
- Uses GPT-4 for understanding context
- Maintains medical accuracy
- Generates patient-friendly explanations
- Extracts and explains key findings

### Medical Terminology
- Database of medical terms
- Simple English definitions
- Related conditions and treatments

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Secure file uploads
- CORS protection
- Input validation
- Error handling

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Report
```javascript
{
  userId: ObjectId,
  title: String,
  fileName: String,
  filePath: String,
  fileType: String (pdf/image/text),
  originalText: String,
  simplifiedReport: String,
  keyFindings: Array,
  medicalTerms: Array,
  status: String (pending/processing/completed),
  uploadDate: Date,
  processedDate: Date
}
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📱 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Voice-to-text input
- [ ] Integration with EHR systems
- [ ] Real-time collaborative viewing
- [ ] Analytics dashboard
- [ ] Export reports as PDF
- [ ] Email notifications
- [ ] Dark mode
- [ ] Advanced search and filters

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚖️ Disclaimer

**Important**: This application is for educational and informational purposes only. It should NOT replace professional medical advice. Always consult with qualified healthcare professionals for medical decisions and interpretations.

## 💬 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the documentation in `/docs` folder
- Email: support@medicalreportsimplifier.com

## 👨‍💻 Authors

Created for better health literacy and accessibility.

---

**Made with ❤️ to make medical information accessible to everyone**
