# CapprossBins

The open-source analytics and binning platform for data-driven decision making.

CapprossBins is a modern, open-source solution for interactive data binning, analytics, and visualization. Built with Next.js, TypeScript, Tailwind CSS, and Python, it enables seamless integration between a powerful frontend and a flexible backend, supporting Jupyter notebooks for advanced data exploration.

## Features

- **Interactive Binning:** Easily bin and analyze datasets using intuitive UI components.
- **Jupyter Notebook Integration:** Run and visualize Python notebooks for advanced analytics.
- **Customizable UI:** Built with Tailwind CSS and modular React components.
- **Analytics Dashboard:** Track and visualize key metrics.
- **Self-hosted & Open-source:** Deploy and customize as needed.

## Demo

![CapprossBins Demo GIF](frontend/public/globe.svg)

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **UI Components:** Custom React components
- **Backend:** Python (FastAPI/Flask), Jupyter Notebook
- **Data Science:** pandas, numpy, scikit-learn (via notebooks)
- **Hosting:** Vercel, local, or cloud

## Getting Started

### Prerequisites

- Node.js (>= 18.17.0)
- Python (>= 3.8)
- Jupyter Notebook
- npm

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd binning-jupyter-notebook
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
pip install -r requirements.txt
```

### 4. Run the backend server

```bash
python main.py
```

### 5. Run the frontend dev server

```bash
cd ../frontend
npm run dev
```

### 6. Open the app in your browser

Visit [http://localhost:3000](http://localhost:3000)

## Jupyter Notebook Usage

- Notebooks are located in the `notebooks/` directory.
- Open and run `2_Binning_v23_One_github.ipynb` for sample binning workflows.

## Contributing

CapprossBins is open-source and welcomes contributions! Fork the repository, make your changes, and submit a pull request.

## About

CapprossBins is designed for data scientists and analysts who need flexible, interactive binning and analytics tools.

---

**Topics:** open-source, binning, analytics, typescript, nextjs, python, jupyter, tailwindcss

**License:** [MIT](LICENSE)

---
