/**
 * Galaxy Swim Smoke Test
 * 
 * Tests basic functionality - Data files validation
 * Note: TypeScript modules require Next.js build, so we only test JSON files here
 */

/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

// Test data files
const testDataFiles = () => {
  console.log('Testing data files...');
  
  try {
    const hotspots = require('../data/hotspots.json');
    const scienceOverlay = require('../data/scienceOverlay.json');
    
    if (!hotspots.hotspots || !Array.isArray(hotspots.hotspots)) {
      throw new Error('hotspots.json is invalid');
    }
    
    if (!scienceOverlay.overlays || !Array.isArray(scienceOverlay.overlays)) {
      throw new Error('scienceOverlay.json is invalid');
    }
    
    // Validate hotspot structure
    hotspots.hotspots.forEach((hotspot, i) => {
      if (!hotspot.id || !hotspot.name || !hotspot.position || !hotspot.card) {
        throw new Error(`Hotspot ${i} is missing required fields`);
      }
      if (!Array.isArray(hotspot.position) || hotspot.position.length !== 3) {
        throw new Error(`Hotspot ${hotspot.id} has invalid position`);
      }
    });
    
    // Validate science overlay structure
    scienceOverlay.overlays.forEach((overlay, i) => {
      if (!overlay.id || !overlay.title || !overlay.triggerConditions) {
        throw new Error(`Overlay ${i} is missing required fields`);
      }
    });
    
    console.log(`✓ Data files valid (${hotspots.hotspots.length} hotspots, ${scienceOverlay.overlays.length} overlays)`);
    return true;
  } catch (error) {
    console.error('✗ Data files test failed:', error.message);
    return false;
  }
};

// Test file structure
const testFileStructure = () => {
  console.log('\nTesting file structure...');
  
  try {
    const basePath = path.join(__dirname, '..');
    const requiredFiles = [
      'page.tsx',
      'galaxy-swim.css',
      'README.md',
      'DELIVERABLES.md',
      'data/hotspots.json',
      'data/scienceOverlay.json',
      'engine/types.ts',
      'engine/qualityManager.ts',
      'engine/fpsMonitor.ts',
      'engine/controls.ts',
      'scene/Galaxy.tsx',
      'scene/Nebula.tsx',
      'scene/Stars.tsx',
      'scene/BlackHoleEffect.tsx',
      'scene/GalaxyScene.tsx',
      'scene/FallbackScene.tsx',
      'ui/HUD.tsx',
      'ui/MomentCard.tsx',
      'ui/LearnMoreModal.tsx',
      'ui/TeleportMenu.tsx',
      'ui/ScienceOverlay.tsx',
      'ui/Toast.tsx',
      'utils/webglDetect.ts',
    ];
    
    let allExist = true;
    requiredFiles.forEach((file) => {
      const filePath = path.join(basePath, file);
      if (!fs.existsSync(filePath)) {
        console.error(`  ✗ Missing file: ${file}`);
        allExist = false;
      }
    });
    
    if (allExist) {
      console.log(`✓ All ${requiredFiles.length} required files exist`);
      return true;
    } else {
      throw new Error('Some files are missing');
    }
  } catch (error) {
    console.error('✗ File structure test failed:', error.message);
    return false;
  }
};

// Test data integrity
const testDataIntegrity = () => {
  console.log('\nTesting data integrity...');
  
  try {
    const hotspots = require('../data/hotspots.json');
    const scienceOverlay = require('../data/scienceOverlay.json');
    
    // Check if science overlays reference valid hotspot zones
    const hotspotIds = new Set(hotspots.hotspots.map(h => h.id));
    
    scienceOverlay.overlays.forEach((overlay) => {
      overlay.triggerConditions.zones.forEach((zone) => {
        if (!hotspotIds.has(zone)) {
          throw new Error(`Overlay "${overlay.id}" references non-existent hotspot zone: ${zone}`);
        }
      });
    });
    
    console.log('✓ Data integrity verified');
    console.log(`  - All science overlays reference valid hotspot zones`);
    return true;
  } catch (error) {
    console.error('✗ Data integrity test failed:', error.message);
    return false;
  }
};

// Run all tests
const runTests = () => {
  console.log('===========================================');
  console.log('Galaxy Swim - Smoke Test');
  console.log('===========================================\n');
  
  const results = [
    testDataFiles(),
    testFileStructure(),
    testDataIntegrity(),
  ];
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log('\n===========================================');
  console.log(`Results: ${passed}/${total} tests passed`);
  console.log('===========================================');
  
  if (passed === total) {
    console.log('\n✓ All smoke tests passed!');
    console.log('\n📝 Note: TypeScript modules will be validated by Next.js during build/runtime.');
    console.log('   To fully test the experience, run: npm run dev');
    console.log('   Then navigate to: http://localhost:3000/space/galaxy-swim');
    process.exit(0);
  } else {
    console.log('\n✗ Some tests failed');
    process.exit(1);
  }
};

// Run tests
runTests();
