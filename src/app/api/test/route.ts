export async function GET() {
    return Response.json({
      message: 'Server is working!',
      environment: process.env.NODE_ENV,
      baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
      backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
      accessToken: process.env.ACCESS_TOKEN,
      refreshToken: process.env.REFRESH_TOKEN
    });
  }