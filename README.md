1) `cd` into project directory
2) `docker build -t image-tagging:local .`
3) `docker run -p 3000:3000 -e "KEY=YOUR_API_KEY" image-tagging:local`
4) app is live at `http://localhost:3000`