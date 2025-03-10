const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generatePWAAssets() {
  const publicDir = path.join(process.cwd(), 'public');
  const sourceIcon = path.join(publicDir, 'favicon.svg');

  try {
    const sourceBuffer = await fs.readFile(sourceIcon);

    // Generate regular icons
    const sizes = [192, 512];
    for (const size of sizes) {
      // Regular icon
      await sharp(sourceBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `icon-${size}.png`));
      console.log(`✓ Generated ${size}x${size} icon`);

      // Maskable icon (with padding for safe area)
      await sharp(sourceBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
          // Add 10% padding for maskable icons
          width: Math.floor(size * 0.9),
          height: Math.floor(size * 0.9),
        })
        .extend({
          top: Math.floor(size * 0.05),
          bottom: Math.floor(size * 0.05),
          left: Math.floor(size * 0.05),
          right: Math.floor(size * 0.05),
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(path.join(publicDir, `icon-${size}-maskable.png`));
      console.log(`✓ Generated ${size}x${size} maskable icon`);
    }

    // Generate Apple touch icons
    const appleSizes = [180];
    for (const size of appleSizes) {
      await sharp(sourceBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `apple-touch-icon-${size}x${size}.png`));
      console.log(`✓ Generated ${size}x${size} Apple touch icon`);
    }

    // Create SVG template for splash screen with text
    const createSplashSVG = isDark => `
      <svg width="1170" height="2532" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${isDark ? '#000000' : '#ffffff'};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${isDark ? '#111111' : '#f8f8f8'};stop-opacity:1" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>
        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes glowPulse {
            0% { opacity: 0.4; }
            50% { opacity: 0.6; }
            100% { opacity: 0.4; }
          }
          .background { animation: fadeIn 1s ease-out; }
          .logo-container { animation: scaleIn 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .title { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s both; }
          .tagline { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s both; }
          .glow { animation: glowPulse 3s ease-in-out infinite; }
        </style>
        
        <!-- Background with subtle gradient -->
        <rect class="background" width="100%" height="100%" fill="url(#bgGradient)"/>
        
        <!-- Decorative elements -->
        <circle cx="585" cy="1166" r="400" fill="${isDark ? '#ffffff' : '#000000'}" opacity="0.03"/>
        <circle cx="585" cy="1166" r="300" fill="${isDark ? '#ffffff' : '#000000'}" opacity="0.02"/>
        
        <!-- Main content group -->
        <g transform="translate(585, 1166)">
          <!-- Glow effect -->
          <circle class="glow" cx="0" cy="0" r="160" 
            fill="${isDark ? '#ffffff' : '#000000'}" 
            opacity="0.1" 
            filter="url(#glow)"
          />
          
          <!-- Logo -->
          <g class="logo-container">
            <image
              x="-100"
              y="-100"
              width="200"
              height="200"
              href="data:image/svg+xml;base64,${sourceBuffer.toString('base64')}"
            />
          </g>
          
          <!-- Text content -->
          <g transform="translate(0, 180)">
            <text
              x="0"
              y="0"
              font-family="Inter"
              font-size="64"
              font-weight="800"
              letter-spacing="-1"
              fill="${isDark ? '#ffffff' : '#000000'}"
              text-anchor="middle"
              class="title"
            >
              DISHYY
            </text>
            
            <text
              x="0"
              y="60"
              font-family="Inter"
              font-size="20"
              font-weight="400"
              fill="${isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}"
              text-anchor="middle"
              letter-spacing="0.5"
              class="tagline"
            >
              WHERE FLAVORS UNITE AND
            </text>
            <text
              x="0"
              y="85"
              font-family="Inter"
              font-size="20"
              font-weight="400"
              fill="${isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}"
              text-anchor="middle"
              letter-spacing="0.5"
              class="tagline"
            >
              FRIENDSHIPS SIMMER
            </text>
          </g>
        </g>
      </svg>
    `;

    // Generate splash screens for each size
    const splashSizes = [
      { width: 640, height: 1136, label: 'splash-640x1136' },
      { width: 828, height: 1792, label: 'splash-828x1792' },
      { width: 1170, height: 2532, label: 'splash' },
      { width: 1290, height: 2796, label: 'splash-1290x2796' },
    ];

    for (const size of splashSizes) {
      // Light version
      await sharp(Buffer.from(createSplashSVG(false)))
        .resize(size.width, size.height)
        .toFile(path.join(publicDir, `${size.label}-light.png`));
      console.log(
        `✓ Generated ${size.width}x${size.height} light splash screen`
      );

      // Dark version
      await sharp(Buffer.from(createSplashSVG(true)))
        .resize(size.width, size.height)
        .toFile(path.join(publicDir, `${size.label}-dark.png`));
      console.log(
        `✓ Generated ${size.width}x${size.height} dark splash screen`
      );
    }

    console.log('✓ All PWA assets generated successfully');
  } catch (error) {
    console.error('Error generating PWA assets:', error);
    process.exit(1);
  }
}

generatePWAAssets();
