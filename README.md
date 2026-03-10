# 🏥 MediGrid: Hospital Resource Management System

MediGrid is a high-performance, real-time dashboard for managing city-wide hospital resources. It provides critical insights into bed availability (General & ICU), ventilator status, and emergency alerts across multiple healthcare facilities.

## 🚀 Features

- **Real-time Monitoring**: Track bed and ventilator availability across zones.
- **Role-Based Access Control (RBAC)**: Custom views for different stakeholders.
- **Critical Alerts**: Instant notification for resource shortages.
- **Analytics Dashboard**: Visual representation of city-wide utilization trends.
- **Search & Filter**: Quickly find available resources by zone or hospital type.

## 👥 Role Permissions

The system implements strict access control to ensure data security and relevance:

| Role | Accessible Features |
| :--- | :--- |
| **City Authority** | Dashboard, Hospitals, Alerts, Analytics |
| **Hospital Admin** | Dashboard, My Hospital Management |
| **User** | Hospital Directory, Resource Search |

## 🛠️ Tech Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Design**: Premium Glassmorphism UI

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/kdt523/MediGrid.git

# Navigate to directory
cd MediGrid

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🎨 UI Preview

The application features a modern dark-mode aesthetic with vibrant cyan accents and smooth glassmorphism effects.

---

*Part of the Advanced Agentic Coding project.*
