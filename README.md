# 🛡️ AnomalyGuard: AI-Based Government Policy Anomaly Detection Platform

**Tagline:** *Detect Fraud. Protect Public Trust. Enable Transparent Governance.*

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Key Features](#key-features)
5. [Tech Stack](#tech-stack)
6. [Architecture](#architecture)
7. [Project Structure](#project-structure)
8. [Installation & Setup](#installation--setup)
9. [Usage](#usage)
10. [How It Works](#how-it-works)
11. [Use Cases](#use-cases)
12. [Future Enhancements](#future-enhancements)
13. [Contributing](#contributing)
14. [License](#license)

---

## 🎯 Project Overview

**AnomalyGuard** is a scalable, AI-powered web platform designed to analyze government policy and public-sector datasets, automatically detecting anomalies, irregular patterns, and potential misuse.

The system acts as a **decision-support tool** for analysts, auditors, and policymakers to:
- Identify data points that deviate from expected behavior
- Reduce financial leakages in welfare schemes
- Improve transparency and accountability in public administration
- Enable data-driven policy evaluation

**Key Impact:**
- Faster audits (up to 40% improvement)
- Millions protected from financial leakage
- Early detection of policy misalignment
- Non-intrusive (supports human judgment, doesn't replace it)

---

## 🔴 Problem Statement

Government policies and welfare schemes generate **massive volumes of data**:
- Beneficiary records
- Budget allocations
- Attendance & payroll data
- Procurement transactions
- Subsidy distributions

### Current Challenges:

| Challenge | Impact |
|-----------|--------|
| **Manual Analysis** | Time-consuming, error-prone, difficult to scale |
| **Undetected Fraud** | Financial leakages often go unnoticed until significant loss occurs |
| **Policy Misalignment** | Actual implementation deviates from intended policy |
| **Inefficiency** | Resource misallocation and duplicate payments |
| **Lack of Accountability** | Limited transparency in public fund disbursement |

**Result:** Billions in wasted/misused public funds annually 💔

---

## ✅ Solution

AnomalyGuard uses **AI-driven anomaly detection** combined with an **interactive dashboard** to:

1. **Automatically analyze** structured datasets (CSV uploads)
2. **Detect suspicious patterns** using multiple ML techniques
3. **Highlight high-risk records** for human review
4. **Visualize insights** through dynamic, interactive charts
5. **Support decision-making** with actionable intelligence

### Key Principle:
> **AI Assists, Humans Decide** — The system flags anomalies; analysts validate and take action.

---

## 🚀 Key Features

### 🔍 **Anomaly Detection Engine**

- ✅ **Multiple Detection Techniques:**
  - Statistical methods (Z-Score, IQR)
  - Isolation Forest (ML-based)
  - Rule-based domain validation
  
- ✅ **Adaptable to Multiple Data Types:**
  - Welfare beneficiary data
  - Attendance & payroll records
  - Budget allocations
  - Procurement transactions
  - Policy implementation metrics

- ✅ **Real-time Scoring:**
  - Anomaly score (0-100)
  - Risk level classification (Critical/High/Medium/Low)
  - Reasoning for flags

### 📊 **Interactive Web Dashboard**

- ✅ **Secure File Upload:**
  - Drag-and-drop CSV upload
  - Data validation before processing
  - File size & format checks

- ✅ **Real-time Analytics:**
  - Animated stat cards (count-up effects)
  - Dynamic charts:
    - Bar chart: Anomalies by department
    - Pie chart: Anomaly vs normal distribution
    - Line chart: Amount trends over time
    - Gauge chart: Detection accuracy %
  - Smooth animations & transitions

- ✅ **Advanced Filtering:**
  - Filter by department, scheme type, risk level
  - Amount range selection
  - Date range filtering
  - Real-time chart updates

- ✅ **Detailed Results:**
  - Suspicious transactions table (sortable, paginated)
  - Top N anomalies ranked by risk/amount
  - Export functionality (CSV, JSON)

### 🔐 **Security & Access Control**

- ✅ **Google OAuth Authentication**
  - Real Google Sign-In integration
  - Secure user session management
  - No raw password storage

- ✅ **Role-Based Access (Future):**
  - Admin (full access)
  - Analyst (view/export)
  - Viewer (read-only)

- ✅ **Data Protection:**
  - Read-only analysis (no data modification)
  - Secure file handling
  - Session timeout

### 📱 **Fully Responsive Design**

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)
- ✅ Smooth animations across all devices

---

## 🛠️ Tech Stack

### **Frontend**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18+ | Component-based UI |
| **Language** | JavaScript (ES6+) | Core logic |
| **Styling** | CSS3 + CSS Variables | Responsive, themeable design |
| **Charts** | Recharts / Chart.js | Dynamic data visualization |
| **Auth** | Google Identity Services | OAuth 2.0 authentication |
| **State Mgmt** | React Hooks | Local state management |
| **Animations** | CSS Transitions + Keyframes | Smooth UX |

**Design Inspiration:** Sift.com (fraud detection SaaS)

### **Backend**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Flask (Python) | REST API server |
| **Database** | MySQL | Data persistence |
| **API Architecture** | RESTful | Clean, scalable endpoints |
| **Authentication** | JWT Tokens | Secure API access |
| **File Handling** | FileStorage | CSV upload processing |

### **AI/ML**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Data Processing** | Pandas, NumPy | CSV parsing, data cleaning |
| **ML Models** | Scikit-learn | Anomaly detection algorithms |
| **Algorithms** | Isolation Forest, Z-Score, IQR | Pattern detection |
| **Model Training** | Online learning | Adapts to new data |
| **Explainability** | Custom logic | Why each record was flagged |
