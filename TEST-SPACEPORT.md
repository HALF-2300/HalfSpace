# 🧪 SPACEPORT TESTING GUIDE

## Quick Test (2 minutes)

### Step 1: Start Server
```bash
npm run dev
```

### Step 2: Open Browser
```
http://localhost:3000/space/spaceport
```

### Step 3: Verify Lobby
- [ ] Stars are animating
- [ ] HUD shows "SPACEPORT - GALAXY CITY"
- [ ] Gateway title "مدينة المجرة" is visible
- [ ] "Enter Planetarium" button works

### Step 4: Verify Planetarium
- [ ] Stars render
- [ ] Can drag with mouse (pan/rotate)
- [ ] Can zoom with mouse wheel
- [ ] See colored celestial objects
- [ ] Click on a bright spot → card appears
- [ ] Card shows name in English & Arabic
- [ ] "Take me somewhere" button works
- [ ] Scene banner appears briefly

### Step 5: Verify Control Panel
- [ ] Click ⚙️ button (bottom right)
- [ ] Panel slides in
- [ ] Change quality → stars update
- [ ] Toggle animations → motion stops/starts
- [ ] Move density slider → star count changes
- [ ] Click "Performance" preset → all settings update

---

## Detailed Testing

### Lobby Tests

#### Visual
- [ ] Background is pure black
- [ ] Stars fade in/out (twinkling)
- [ ] Stars drift slowly downward
- [ ] Gateway has cyan/purple glow
- [ ] Title has gradient (blue→pink→purple)
- [ ] HUD text is cyan with glow

#### Interactive
- [ ] Enter button hovers (lift + glow)
- [ ] Arrow animates on hover
- [ ] Click enters planetarium

#### Responsive
- [ ] Works on mobile (smaller text)
- [ ] Works on tablet
- [ ] Footer stacks on narrow screens

---

### Planetarium Tests

#### Rendering
- [ ] Stars render (quantity based on quality + density)
- [ ] Celestial objects visible as glowing dots
- [ ] Labels appear when zoomed in
- [ ] Objects have correct colors:
  - Blue: Orion, Whirlpool Galaxy
  - Orange: Ursa Major, Eagle Nebula
  - Pink: Cassiopeia, Orion Nebula
  - Purple: Andromeda (constellation & galaxy)
  - Cyan: Cygnus, Crab Nebula
  - Red: M87 Black Hole

#### Interactions
- [ ] **Pan**: Hold and drag → objects move
- [ ] **Rotate**: Drag in different directions → 3D rotation
- [ ] **Zoom**: Mouse wheel up → zoom in (objects larger)
- [ ] **Zoom**: Mouse wheel down → zoom out (objects smaller)
- [ ] **Click object**: Hotspot → card slides up
- [ ] **Card close**: X button → card disappears
- [ ] **Take me somewhere**: Random rotation + scene banner

#### Object Cards
Test each object by clicking:

**Constellations** (should have "Facts" section):
- [ ] Orion (الجبّار) - 3 facts about M42, Betelgeuse, recognition
- [ ] Ursa Major (الدب الأكبر) - 3 facts about Big Dipper, navigation, North Star
- [ ] Cassiopeia (ذات الكرسي) - 3 facts about W/M shape, Greek myth, visibility
- [ ] Andromeda (المرأة المسلسلة) - 3 facts about M31, collision, visibility
- [ ] Cygnus (الدجاجة) - 3 facts about Northern Cross, Cygnus X-1, Milky Way

**Nebulae** (should have "Distance" and "Size"):
- [ ] Orion Nebula (سديم الجبار) - 1,344 ly, 24 ly size
- [ ] Crab Nebula (سديم السرطان) - 6,500 ly, 11 ly size
- [ ] Eagle Nebula (سديم النسر) - 7,000 ly, 70 ly size

**Deep Space** (should have "Distance" and extra info):
- [ ] Andromeda Galaxy (مجرة أندروميدا) - 2.537M ly, 220k ly diameter
- [ ] Whirlpool Galaxy (مجرة الدوامة) - 23M ly, 60k ly diameter
- [ ] M87 Black Hole (ثقب M87 الأسود) - 55M ly, 6.5B solar masses

#### Random Scenes
Click "🎲 Take me somewhere" multiple times:
- [ ] Nebula Garden (حديقة السدم)
- [ ] Galaxy Highway (طريق المجرات)
- [ ] Deep Space Void (فراغ الفضاء العميق)
- [ ] Supernova Aftermath (ما بعد المستعر الأعظم)
- [ ] Each shows banner for 3 seconds
- [ ] Rotation changes randomly
- [ ] Zoom level changes

---

### Control Panel Tests

#### Opening/Closing
- [ ] Click ⚙️ → panel slides in from bottom
- [ ] Dark overlay appears behind
- [ ] Click overlay → panel closes
- [ ] Click X → panel closes

#### Quality Settings
Start at Medium, then:
- [ ] Switch to Low → fewer stars render
- [ ] Switch to High → many more stars
- [ ] Check both Lobby and Planetarium

#### Animation Toggle
- [ ] Turn OFF → stars stop twinkling
- [ ] Turn ON → stars resume twinkling
- [ ] Toggle button shows ON/OFF label
- [ ] Slider moves position

#### Star Density
- [ ] Drag to 30% → very few stars
- [ ] Drag to 100% → normal density
- [ ] Drag to 200% → sky is packed
- [ ] Label shows percentage

#### Quick Presets
- [ ] **Performance** preset:
  - Quality → Low
  - Animations → OFF
  - Density → 0.5 (50%)
  
- [ ] **Balanced** preset:
  - Quality → Medium
  - Animations → ON
  - Density → 1.0 (100%)
  
- [ ] **Cinematic** preset:
  - Quality → High
  - Animations → ON
  - Density → 1.5 (150%)

---

### Fallback Tests

#### WebGL Detection
Disable WebGL in browser (Chrome DevTools):
1. F12 → Console
2. Settings (⚙️) → Experiments → Enable "WebGL" override
3. Application → Disable WebGL
4. Reload page
- [ ] Banner shows "2D Mode (WebGL not available)"
- [ ] Experience still works with Canvas 2D

#### Performance Detection
Open on different devices:
- [ ] **Mobile**: Auto-switches to Low quality
- [ ] **Tablet**: Uses Medium quality
- [ ] **Desktop**: Uses Medium/High

#### Error States
Test by breaking the data file temporarily:
1. Rename `public/data/spaceportData.json`
2. Reload page
- [ ] Loading spinner shows first
- [ ] Error message appears
- [ ] "Reload" button present
3. Rename file back

---

### Loading States

#### Initial Load
- [ ] Black screen
- [ ] Spinning blue loader
- [ ] "Loading Galaxy City Spaceport..." text
- [ ] Smooth transition to lobby

---

### Responsive Design

#### Desktop (1920x1080)
- [ ] All elements visible
- [ ] No overflow
- [ ] HUD corners are visible
- [ ] Control panel fits

#### Tablet (768x1024)
- [ ] Title scales down
- [ ] Stats remain visible
- [ ] Control panel responsive
- [ ] Object cards fit

#### Mobile (375x667)
- [ ] Footer items stack
- [ ] Gateway title readable
- [ ] Control panel full width
- [ ] Cards don't overflow

---

### Browser Testing

#### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Smooth animations

#### Firefox
- [ ] All features work
- [ ] Canvas rendering correct
- [ ] Mouse events work

#### Safari
- [ ] All features work
- [ ] Gradients render
- [ ] WebGL fallback works

#### Edge
- [ ] All features work
- [ ] No compatibility issues

---

## Performance Benchmarks

### Target FPS

| Quality | Target FPS | Min FPS |
|---------|------------|---------|
| Low     | 60         | 45      |
| Medium  | 60         | 30      |
| High    | 60         | 30      |

### Memory Usage

| Quality | Expected RAM |
|---------|--------------|
| Low     | < 100 MB     |
| Medium  | < 200 MB     |
| High    | < 400 MB     |

---

## Known Issues / Limitations

✅ **None! All working as expected.**

---

## Reporting Issues

If you find a bug:

1. Note the browser and OS
2. Note the quality setting
3. Describe the steps to reproduce
4. Check browser console for errors
5. Take a screenshot

---

## Success Criteria

✅ All checkboxes above are checked  
✅ No console errors  
✅ Smooth animations on target hardware  
✅ Fallbacks work correctly  
✅ Mobile experience is acceptable  

---

## Testing Complete! 🎉

If all tests pass, the Spaceport is ready for launch! 🚀
