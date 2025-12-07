from fastapi import FastAPI
from dotenv import load_dotenv
from routes import router

# Load env
load_dotenv()

app = FastAPI()

# Register routes
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
