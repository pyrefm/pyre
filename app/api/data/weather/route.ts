import { NextRequest, NextResponse } from 'next/server';
import { withTokenPayment } from '@/lib/payments/middleware';
import axios from 'axios';

// Using wttr.in - completely free, no API key needed
const WTTR_API = 'https://wttr.in';

async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');

    if (!city) {
      return NextResponse.json(
        {
          success: false,
          error: 'City parameter is required',
          code: 'MISSING_PARAMETER',
        },
        { status: 400 }
      );
    }

    // Fetch real weather data from wttr.in
    const response = await axios.get(
      `${WTTR_API}/${encodeURIComponent(city)}?format=j1`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'PYRE-API/1.0',
        },
      }
    );

    const data = response.data;
    const current = data.current_condition?.[0];
    const location = data.nearest_area?.[0];

    if (!current) {
      return NextResponse.json(
        {
          success: false,
          error: 'Weather data not available for this location',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        location: {
          city: location?.areaName?.[0]?.value || city,
          region: location?.region?.[0]?.value || '',
          country: location?.country?.[0]?.value || '',
        },
        current: {
          temperature: {
            celsius: parseInt(current.temp_C),
            fahrenheit: parseInt(current.temp_F),
          },
          feelsLike: {
            celsius: parseInt(current.FeelsLikeC),
            fahrenheit: parseInt(current.FeelsLikeF),
          },
          humidity: parseInt(current.humidity),
          description: current.weatherDesc?.[0]?.value || 'Unknown',
          windSpeed: {
            kmh: parseInt(current.windspeedKmph),
            mph: parseInt(current.windspeedMiles),
          },
          windDirection: current.winddir16Point,
          visibility: parseInt(current.visibility),
          uvIndex: parseInt(current.uvIndex),
          pressure: parseInt(current.pressure),
        },
        timestamp: new Date().toISOString(),
        source: 'wttr.in',
      },
    });
  } catch (error) {
    console.error('Weather API error:', error);

    // Return proper error response instead of fake data
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.error || error.message
      : 'Failed to fetch weather data';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: 'EXTERNAL_API_ERROR',
        message: 'Unable to fetch data from weather service. Please try again later.',
      },
      { status: 502 }
    );
  }
}

// Price: $0.01 per request - 30% ($0.003) burned!
export const GET = withTokenPayment(handler, 0.01);
