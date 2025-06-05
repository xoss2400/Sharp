# ChineeBot

A modern Chinese translation application with a unique battle animation interface. Built with Electron and Python, this application combines language learning with an engaging visual experience.

## Features

- **Real-time Chinese Translation**: Instantly translate Chinese text to English
- **Pinyin Support**: Get pronunciation guides for Chinese characters
- **Interactive UI**: Features a unique battle animation in the drag bar
- **Modern Design**: Clean, translucent interface with emerald green theme
- **Great Wall Theme**: Battle animation set against a Great Wall of China backdrop

## Technical Stack

- **Frontend**: Electron, HTML, CSS, JavaScript
- **Backend**: Python
- **Animation**: CSS animations and transitions
- **Styling**: Custom CSS with modern design principles

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ChineeBot.git
cd ChineeBot
```

2. Install Python dependencies:

```bash
cd python-backend
pip install -r requirements.txt
```

3. Install Node.js dependencies:

```bash
cd ../electron-frontend
npm install
```

## Running the Application

1. Start the Python backend:

```bash
cd python-backend
python app.py
```

2. In a new terminal, start the Electron frontend:

```bash
cd electron-frontend
npm start
```

## Project Structure

```
ChineeBot/
├── electron-frontend/    # Electron application
│   ├── index.html       # Main window
│   ├── styles.css       # Styling
│   └── renderer.js      # Frontend logic
├── python-backend/      # Python server
│   ├── app.py          # Main server
│   └── requirements.txt # Python dependencies
└── README.md           # This file
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
