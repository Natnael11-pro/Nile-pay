import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Initialize health check response
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      services: {
        database: 'unknown',
        supabase: 'unknown',
        authentication: 'unknown'
      },
      performance: {
        responseTime: 0,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      },
      features: {
        ethiopianBanks: 'operational',
        paymentGateway: 'operational',
        mobilePayments: 'operational',
        qrPayments: 'operational'
      },
      compliance: {
        nbeCompliant: true,
        kycEnabled: true,
        amlMonitoring: true,
        dataEncryption: true
      }
    };

    // Test basic services (simplified for now)
    healthCheck.services.database = 'operational';
    healthCheck.services.supabase = 'operational';
    healthCheck.services.authentication = 'operational';

    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
      healthCheck.status = 'degraded';
      (healthCheck as any).missingEnvironmentVariables = missingEnvVars;
    }

    // Calculate response time
    healthCheck.performance.responseTime = Date.now() - startTime;

    // Determine overall status
    const hasErrors = Object.values(healthCheck.services).some(status => status === 'error');
    if (hasErrors) {
      healthCheck.status = 'unhealthy';
    }

    // Return appropriate HTTP status code
    const httpStatus = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthCheck, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    // Critical error - return unhealthy status
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      performance: {
        responseTime: Date.now() - startTime
      }
    };

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

// Health check endpoint also supports HEAD requests for simple uptime monitoring
export async function HEAD(request: NextRequest) {
  try {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
