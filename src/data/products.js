export const COMPANY_INFO = {
  name: 'DroneHub Australia',
  abn: '48 612 908 124',
  phone: '1300 544 968',
  email: 'enquiries@dronehub.com.au',
  base: 'Mackay, Queensland',
  address: 'Cnr Gordon & Gregory Streets, Mackay QLD 4740',
  crews: ['Mackay (HQ)', 'Brisbane', 'Gold Coast', 'Sydney'],
  serviceAreas: ['Bowen Basin', 'QLD', 'NSW', 'VIC'],
  casaCertification: 'CASA.ReOC.8842 Certified Commercial RPAS Operator',
  turnaround: '48h Priority Mackay Workshop Turnaround',
};

export const DRONES = [
  {
    id: 'dji-matrice-350-rtk',
    series: 'matrice',
    series_name: 'Matrice',
    name: 'DJI Matrice 350 RTK Flagship Enterprise Airframe',
    sku: 'DH-M350-RTK',
    brand: 'DJI Enterprise',
    category: 'drones',
    price_cents: 1499900, // $14,999.00 AUD
    stock_qty: 6,
    image_url: '/images/hero-enterprise-drone.jpg',
    short_description: 'Flagship enterprise drone engineered for Bowen Basin open-cut mining surveys, electrical grid inspection, and all-weather emergency response.',
    description: 'The DJI Matrice 350 RTK is an upgraded enterprise flagship that sets a new benchmark for the commercial drone industry. Built to withstand punishing Australian mining conditions with an IP55 ingress protection rating and operating temperatures up to 50°C. Features next-generation O3 Enterprise transmission delivering 20 km of 3-channel 1080p HD live feed and redundant avionics.',
    flight_time: '55 Min Max Flight Time',
    ip_rating: 'IP55 Dust & Rain Sealed',
    warranty_months: 24,
    casa_note: 'Requires CASA Operator Accreditation or ReOC for commercial mining operations. Airframe serial pre-registered for CASA drone portal.',
    specs: [
      { label: 'Max Flight Time', value: '55 Minutes (no payload), 43 Min with H20T' },
      { label: 'Ingress Protection', value: 'IP55 Weather & Coal Dust Sealed' },
      { label: 'Max Wind Resistance', value: '12 m/s (43.2 km/h)' },
      { label: 'Max Payload Capacity', value: '2.7 kg (Triple Gimbal Support)' },
      { label: 'Transmission System', value: 'DJI O3 Enterprise (20 km Range)' },
      { label: 'Operating Temperature', value: '-20°C to 50°C (Australian Summer Ready)' },
      { label: 'Positioning Precision', value: 'Centimeter-Level RTK Fixed' }
    ],
    // Parts specifically for Matrice 350
    parts: [
      {
        id: 'part-m350-props',
        drone_id: 'dji-matrice-350-rtk',
        name: 'Matrice 350 2110 High-Altitude Carbon Propellers (Pair)',
        sku: 'DH-PRP-2110',
        brand: 'DJI Enterprise',
        category: 'parts',
        price_cents: 14900, // $149.00 AUD
        stock_qty: 90,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Precision balanced genuine replacement carbon composite propellers engineered for quiet operation and high aerodynamic efficiency.',
        description: 'Original DJI 2110 Low-Noise Propellers for M350/M300. Precision engineered to resist abrasive dust particles found across Central Queensland coal mines.',
        specs: [
          { label: 'Material', value: 'High-Tensile Carbon Fiber Composite' },
          { label: 'Diameter × Pitch', value: '21 × 10 inches' },
          { label: 'Package Includes', value: '1 CW + 1 CCW Propeller' }
        ]
      },
      {
        id: 'part-m350-arm-locks',
        drone_id: 'dji-matrice-350-rtk',
        name: 'Matrice 350 Quick-Release Arm Hinge Lock Kit',
        sku: 'DH-LCK-M350',
        brand: 'DJI Enterprise',
        category: 'parts',
        price_cents: 21000, // $210.00 AUD
        stock_qty: 35,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Heavy-duty CNC machined replacement arm locking collar kit with optical sleeve sensor.',
        description: 'Ensures rigid carbon arm locking during high-vibration mining survey flights. Includes integrated sleeve sensors communicating directly with flight telemetry.',
        specs: [
          { label: 'Material', value: 'Aviation Aluminum CNC' },
          { label: 'Sensor', value: 'Arm Lock Detection Sensor' }
        ]
      },
      {
        id: 'part-m350-gimbal-cable',
        drone_id: 'dji-matrice-350-rtk',
        name: 'Matrice 350 Dual-Gimbal Downward Connector Cable Harness',
        sku: 'DH-CBL-M350-DUAL',
        brand: 'DJI Enterprise',
        category: 'parts',
        price_cents: 35000, // $350.00 AUD
        stock_qty: 18,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'High-speed shielded ribbon cable enabling dual downward payload synchronization.',
        description: 'Factory original dual payload connector harness supporting simultaneous thermal and zoom sensor configurations.',
        specs: [
          { label: 'Compatibility', value: 'Matrice 350 RTK / Matrice 300 RTK' },
          { label: 'Shielding', value: 'EMI Mining Pit Anti-Interference Shielded' }
        ]
      }
    ],
    // Accessories specifically for Matrice 350
    accessories: [
      {
        id: 'acc-tb65-battery',
        drone_id: 'dji-matrice-350-rtk',
        name: 'DJI TB65 Intelligent Flight Battery (5,880 mAh)',
        sku: 'DH-BAT-TB65',
        brand: 'DJI Enterprise',
        category: 'accessories',
        price_cents: 129900, // $1,299.00 AUD
        stock_qty: 48,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'High-energy 5,880 mAh dual-redundant battery with built-in self-heating for winter mornings and 400 charge cycles rating.',
        description: 'Genuine DJI TB65 battery for Matrice 350 RTK. Features an advanced heat dissipation system and up to 400 battery cycles to lower total cost of flight hour operation for Bowen Basin industrial teams.',
        specs: [
          { label: 'Capacity', value: '5,880 mAh / 263.2 Wh' },
          { label: 'Voltage', value: '44.76 V' },
          { label: 'Cycle Life', value: '400 Battery Flight Cycles' },
          { label: 'Self-Heating', value: 'Automated Winter Morning Pre-Heat' }
        ]
      },
      {
        id: 'acc-zenmuse-h20t',
        drone_id: 'dji-matrice-350-rtk',
        name: 'Zenmuse H20T Quad-Sensor Radiometric Thermal & Laser Payload',
        sku: 'DH-ZEN-H20T',
        brand: 'DJI Enterprise',
        category: 'accessories',
        price_cents: 1580000, // $15,800.00 AUD
        stock_qty: 4,
        image_url: '/images/hero-enterprise-drone.jpg',
        short_description: 'Integrated payload featuring a 20MP Zoom, 12MP Wide, 640×512 Radiometric Thermal, and 1200m Laser Rangefinder.',
        description: 'Turn your Matrice 350 RTK into an aerial inspection powerhouse. Instantly calculate distance and precise GPS coordinates of haul trucks or equipment in the pit with the 1200m laser rangefinder.',
        specs: [
          { label: 'Thermal Sensor', value: 'Uncooled VOx Microbolometer 640×512' },
          { label: 'Optical Zoom', value: '23× Hybrid Optical, 200× Max Zoom' },
          { label: 'Laser Rangefinder', value: '3m to 1200m (±0.2m Accuracy)' }
        ]
      },
      {
        id: 'acc-rc-plus',
        drone_id: 'dji-matrice-350-rtk',
        name: 'DJI RC Plus Enterprise Smart Controller (Australia Spec)',
        sku: 'DH-RC-PLUS-AU',
        brand: 'DJI Enterprise',
        category: 'accessories',
        price_cents: 289900, // $2,899.00 AUD
        stock_qty: 8,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'High-bright 7-inch 1,200 nit screen with physical buttons, external battery hot-swapping, and IP54 weather rating.',
        description: 'Designed for Australian outdoor conditions where standard tablets overheat or wash out under the harsh Queensland sun. Operates continuously with hot-swappable external WB37 batteries.',
        specs: [
          { label: 'Screen', value: '7.02-inch Touchscreen (1,200 nits daylight readable)' },
          { label: 'Ingress Protection', value: 'IP54 Weather Sealed' },
          { label: 'Battery Life', value: 'Up to 6 Hours with external WB37 battery' }
        ]
      }
    ]
  },
  {
    id: 'dji-agras-t100',
    series: 't100',
    series_name: 'T100',
    name: 'DJI Agras T100 Heavy-Lift Forestry & Broadacre Spraying Drone',
    sku: 'DH-AG-T100',
    brand: 'DJI Agriculture',
    category: 'drones',
    price_cents: 4890000, // $48,900.00 AUD
    stock_qty: 2,
    image_url: '/images/hero-enterprise-drone.jpg',
    short_description: 'Flagship 100kg maximum payload heavy coaxial octa-rotor drone engineered for high-altitude forestry canopy spraying and ultra-broadacre pasture treatment.',
    description: 'The pinnacle of commercial agricultural aviation. The DJI Agras T100 features heavy coaxial octa-rotor propulsion delivering unprecedented lift capacity. Dual high-pressure brushless spray pumps produce up to 32 L/min flow rate with quad-centrifugal atomizers for penetrating tall timber and eucalyptus canopies.',
    flight_time: '22 Min Loaded Flight Time',
    ip_rating: 'IPX6K Heavy Washdown Sealed',
    warranty_months: 12,
    casa_note: 'Requires CASA heavy drone endorsement (>25kg MTOW) and chemical application aerial contractor authorization.',
    specs: [
      { label: 'Payload Capacity', value: '100 kg (120L Spreader / 75L Spray)' },
      { label: 'Propulsion', value: 'High-Torque Coaxial Octa-Rotor System' },
      { label: 'Effective Swath', value: 'Up to 16 Meters Swath Width' },
      { label: 'Radar Sensing', value: 'Front & Rear Active Phased Array Radar' },
      { label: 'Pump Flow Rate', value: '32 L/min Dual Brushless Pumps' }
    ],
    parts: [
      {
        id: 'part-t100-props',
        drone_id: 'dji-agras-t100',
        name: 'Agras T100 60-inch Carbon Coaxial Propeller Set (4 Blades)',
        sku: 'DH-PRP-T100',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 38000,
        stock_qty: 20,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: '60-inch ultra-high-thrust folding carbon composite propellers for 100kg heavy-lift payload operations.',
        description: 'Original DJI 60-inch carbon folding props designed to handle extreme aerodynamic loads during high-velocity forestry aerial spraying.',
        specs: [
          { label: 'Diameter', value: '60 inches Coaxial Profile' },
          { label: 'Material', value: 'High-Density Reinforced Carbon' }
        ]
      },
      {
        id: 'part-t100-pump',
        drone_id: 'dji-agras-t100',
        name: 'Agras T100 Dual High-Flow Brushless Impeller Pump (32 L/min)',
        sku: 'DH-PMP-T100',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 115000,
        stock_qty: 8,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'High-capacity 32 L/min chemical delivery pump with anti-corrosion ceramic shaft.',
        description: 'Engineered for rapid broadacre chemical discharge. Fully sealed brushless pump unit impervious to agricultural herbicides.',
        specs: [
          { label: 'Flow Rate', value: '32 Litres/min Maximum Output' },
          { label: 'Shaft Material', value: 'Industrial Zirconia Ceramic' }
        ]
      },
      {
        id: 'part-t100-lock',
        drone_id: 'dji-agras-t100',
        name: 'Agras T100 Heavy Arm Folding Lock Assembly Kit',
        sku: 'DH-LCK-T100',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 49000,
        stock_qty: 15,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Reinforced CNC aircraft aluminum arm folding collars with dual electronic safety interlocks.',
        description: 'Heavy-duty arm hinge locks ensuring total structural rigidity during high-g forestry turning maneuvers.',
        specs: [
          { label: 'Material', value: 'CNC 7075 Aviation Aluminum' }
        ]
      }
    ],
    accessories: [
      {
        id: 'acc-t100-battery',
        drone_id: 'dji-agras-t100',
        name: 'DJI DB2000 Ultra-High Energy Flight Battery (40,000 mAh)',
        sku: 'DH-BAT-DB2000',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 365000,
        stock_qty: 10,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Massive 40Ah flight battery delivering sustained high-current output for 100kg maximum payload lifting.',
        description: 'Powers the heavy-lift Agras T100 through rigorous broadacre cycles. Water-cooling jacket allows 9-minute rapid hot recharge turnaround.',
        specs: [
          { label: 'Capacity', value: '40,000 mAh / 2,048 Wh' },
          { label: 'Recharge Time', value: '9-11 min with 12000W EFI Generator' }
        ]
      },
      {
        id: 'acc-t100-gen',
        drone_id: 'dji-agras-t100',
        name: 'Agras T100 12000W Intelligent EFI Fast Generator & Charger',
        sku: 'DH-GEN-T100',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 520000,
        stock_qty: 3,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: '12,000W electronic fuel-injected field charging generator with immersion cooling tank.',
        description: 'Charges two DB2000 batteries simultaneously in the back of your service truck. Electronic fuel injection cuts fuel use by 15%.',
        specs: [
          { label: 'Power Output', value: '12,000W Continuous EFI' }
        ]
      },
      {
        id: 'acc-t100-spreader',
        drone_id: 'dji-agras-t100',
        name: 'Agras T100 120L Forestry & Broadacre Granule Spreader',
        sku: 'DH-SPRD-T100',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 320000,
        stock_qty: 4,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Extra-large 120L payload hopper with dual high-speed spinner discs for urea and pasture seed.',
        description: 'Discharges up to 150 kg/min of granule fertilizer for rapid pastoral seeding and broadacre nutrient top-dressing.',
        specs: [
          { label: 'Capacity', value: '120 Litres (100 kg Dry Granule)' }
        ]
      }
    ]
  },
  {
    id: 'dji-agras-t70',
    series: 't70',
    series_name: 'T70',
    name: 'DJI Agras T70 High-Capacity Broadacre Spraying Drone',
    sku: 'DH-AG-T70',
    brand: 'DJI Agriculture',
    category: 'drones',
    price_cents: 3850000, // $38,500.00 AUD
    stock_qty: 3,
    image_url: '/images/hero-enterprise-drone.jpg',
    short_description: 'High-capacity 70kg payload agricultural drone with 14m spray swath for massive Central Queensland sugarcane and grain acreage.',
    description: 'Designed to bridge the gap between medium sprayers and heavy forestry airframes. The Agras T70 carries 70kg of spreading or 55L of spraying formulation with dual atomized centrifugal nozzles and high-penetration downwash.',
    flight_time: '24 Min Loaded Flight Time',
    ip_rating: 'IPX6K Washable',
    warranty_months: 12,
    casa_note: 'Requires CASA heavy drone endorsement (>25kg MTOW) and chemical application aerial contractor authorization.',
    specs: [
      { label: 'Payload Capacity', value: '70 kg (90L Spreader / 55L Spray)' },
      { label: 'Effective Swath', value: 'Up to 14 Meters' },
      { label: 'Radar Sensing', value: '360° Omnidirectional Active Phased Array' }
    ],
    parts: [
      {
        id: 'part-t70-nozzles',
        drone_id: 'dji-agras-t70',
        name: 'Agras T70 Quad Centrifugal Atomizing Nozzles Kit',
        sku: 'DH-NOZ-T70',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 58000,
        stock_qty: 18,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Four-point centrifugal spray nozzles for uniform droplet deposition on broadacre crops.',
        description: 'Adjustable atomizers allow ultra-fine droplet control from 50 to 500 microns to stop drift under Australian trade winds.',
        specs: [
          { label: 'Droplet Range', value: '50-500 μm Variable' }
        ]
      },
      {
        id: 'part-t70-props',
        drone_id: 'dji-agras-t70',
        name: 'Agras T70 56-inch Carbon Folding Propeller Pair',
        sku: 'DH-PRP-T70',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 32000,
        stock_qty: 24,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'High-lift carbon fiber folding propellers optimized for 70kg payload hover stability.',
        description: 'Reinforced composite matrix resists abrasion when operating near dusty field margins and cane rows.',
        specs: [
          { label: 'Diameter', value: '56 inches Folding' }
        ]
      },
      {
        id: 'part-t70-meter',
        drone_id: 'dji-agras-t70',
        name: 'Agras T70 Magnetic Flow Meter & Sensor Harness',
        sku: 'DH-SEN-T70',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 38000,
        stock_qty: 14,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Precision electromagnetic flow meter measuring real-time chemical dosage rate.',
        description: 'Monitors flow rate with ±2% accuracy to ensure exact spray volume per hectare matches agronomy prescriptions.',
        specs: [
          { label: 'Accuracy', value: '±2% Real-Time Flow Monitoring' }
        ]
      }
    ],
    accessories: [
      {
        id: 'acc-t70-battery',
        drone_id: 'dji-agras-t70',
        name: 'DJI DB1800 Intelligent Flight Battery (35,000 mAh)',
        sku: 'DH-BAT-DB1800',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 325000,
        stock_qty: 12,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: '35,000 mAh heavy-duty flight battery with 1,500 cycle warranty and water-immersion cooling.',
        description: 'Delivers reliable high-amperage current for broadacre spraying under 40°C Australian summer temperatures.',
        specs: [
          { label: 'Capacity', value: '35,000 mAh / 1,792 Wh' }
        ]
      },
      {
        id: 'acc-t70-spreader',
        drone_id: 'dji-agras-t70',
        name: 'Agras T70 90L Dry Granule Spreading Hopper System',
        sku: 'DH-SPRD-T70',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 275000,
        stock_qty: 5,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Quick-detach 90L hopper with spiral auger feeder for granular fertilizer and pasture seed.',
        description: 'Handles up to 120 kg/min spreading output with dual high-speed spinning disc spreaders.',
        specs: [
          { label: 'Capacity', value: '90 Litres (70 kg payload)' }
        ]
      },
      {
        id: 'acc-t70-charger',
        drone_id: 'dji-agras-t70',
        name: 'Agras T70 10000W Inverter Fast Field Charger',
        sku: 'DH-CHG-T70',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 440000,
        stock_qty: 4,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: '10,000W rapid dual-channel battery charger for non-stop field rotation.',
        description: 'Brings DB1800 batteries from 30% to 95% in 9-10 minutes with active water-jacket cooling.',
        specs: [
          { label: 'Power', value: '10,000W Inverter Charger' }
        ]
      }
    ]
  },
  {
    id: 'dji-agras-t50',
    series: 't50',
    series_name: 'T50',
    name: 'DJI Agras T50 Broadacre Crop Spraying & Seeding Drone',
    sku: 'DH-AG-T50',
    brand: 'DJI Agriculture',
    category: 'drones',
    price_cents: 3250000, // $32,500.00 AUD
    stock_qty: 3,
    image_url: '/images/hero-enterprise-drone.jpg',
    short_description: 'Industrial 50kg spreading and 40kg spraying capacity heavy-lift drone designed for broadacre sugarcane in Mackay and pastoral grazing stations.',
    description: 'Engineered specifically for heavy-duty Australian agricultural contractors. Dual atomized centrifugal spray nozzles provide uniform droplet penetration through dense crop canopies. Active Phased Array Radar and dual binocular vision systems maintain terrain following even on undulating hillsides.',
    flight_time: '25 Min Loaded Flight Time',
    ip_rating: 'IPX6K Heavy Washdown Sealed',
    warranty_months: 12,
    casa_note: 'Requires CASA heavy drone endorsement (>25kg MTOW) and chemical application aerial contractor authorization.',
    specs: [
      { label: 'Spreading Payload', value: '50 kg (75L Dry Granule Capacity)' },
      { label: 'Spraying Payload', value: '40 kg (Liquid Formulation)' },
      { label: 'Spray Width', value: 'Up to 11 Meters Effective Swath' },
      { label: 'Radar Sensing', value: 'Active Phased Array 360° Radar' },
      { label: 'Waterproof Rating', value: 'IPX6K Washable with High-Pressure Hose' }
    ],
    // Parts specifically for Agras T50
    parts: [
      {
        id: 'part-t50-nozzles',
        drone_id: 'dji-agras-t50',
        name: 'Agras T50 Centrifugal Atomized Spray Nozzle Kit (Pair)',
        sku: 'DH-NOZ-T50',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 42000, // $420.00 AUD
        stock_qty: 24,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Adjustable droplet micron size centrifugal atomizers for dense crop canopy penetration.',
        description: 'Genuine DJI Agras T50 atomizing nozzles. Allows variable droplet sizing from 50 to 500 microns to avoid chemical drift under Australian crosswinds.',
        specs: [
          { label: 'Droplet Size', value: '50-500 μm Adjustable' },
          { label: 'Flow Rate', value: 'Up to 16 L/min Dual Atomizer' }
        ]
      },
      {
        id: 'part-t50-pump',
        drone_id: 'dji-agras-t50',
        name: 'Agras T50 High-Pressure Magnetic Drive Impeller Pump',
        sku: 'DH-PMP-T50',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 89000, // $890.00 AUD
        stock_qty: 12,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Chemical-resistant sealed magnetic impeller pump for aggressive liquid fertilizers.',
        description: 'Corrosion-proof magnetic drive pump built to handle Australian agricultural chemicals, fungicides, and liquid foliar fertilizers.',
        specs: [
          { label: 'Type', value: 'Sealed Magnetic Drive Impeller' },
          { label: 'Flow Rate', value: '24 L/min Maximum Pressure' }
        ]
      },
      {
        id: 'part-t50-rotors',
        drone_id: 'dji-agras-t50',
        name: 'Agras T50 Heavy-Lift Carbon Fiber Propeller Pair (54-inch)',
        sku: 'DH-PRP-T50',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 28000, // $280.00 AUD
        stock_qty: 30,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: '54-inch ultra-rigid high-thrust carbon composite folding propellers.',
        description: 'High-lift folding agricultural propellers engineered for maximum efficiency when hauling 50kg payloads in high heat.',
        specs: [
          { label: 'Diameter', value: '54 inches High-Thrust Profile' },
          { label: 'Material', value: 'High-Density Reinforced Carbon' }
        ]
      }
    ],
    // Accessories specifically for Agras T50
    accessories: [
      {
        id: 'acc-t50-spreader',
        drone_id: 'dji-agras-t50',
        name: 'Agras T50 75L High-Capacity Granule Spreading System',
        sku: 'DH-SPRD-T50',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 240000, // $2,400.00 AUD
        stock_qty: 6,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Quick-swap 75L hopper with spiral delivery motor for seeds, pasture grasses, and fertilizer.',
        description: 'Swap from spraying to spreading in under 3 minutes. Discharges up to 108 kg/min of urea or pasture seeds evenly across pastoral country.',
        specs: [
          { label: 'Capacity', value: '75 Litres (50 kg payload)' },
          { label: 'Discharge Rate', value: 'Up to 108 kg/min' }
        ]
      },
      {
        id: 'acc-t50-charger',
        drone_id: 'dji-agras-t50',
        name: 'Agras T50 9000W Intelligent Fast Inverter Generator & Charger',
        sku: 'DH-CHG-T50-9K',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 395000, // $3,950.00 AUD
        stock_qty: 4,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: '9000W electronic fuel-injected generator capable of 9-minute rapid battery turnarounds in the field.',
        description: 'Charge batteries non-stop directly in the back of the ute. Charges a 30Ah DB1560 battery from 30% to 95% in just 9 minutes with active water-cooling tank.',
        specs: [
          { label: 'Output Power', value: '9,000 Watts EFI' },
          { label: 'Charge Speed', value: '9-12 Minutes per battery' }
        ]
      },
      {
        id: 'acc-t50-battery',
        drone_id: 'dji-agras-t50',
        name: 'DJI DB1560 Intelligent Flight Battery (30,000 mAh)',
        sku: 'DH-BAT-DB1560',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 285000, // $2,850.00 AUD
        stock_qty: 15,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Heavy 30Ah high-output battery pack rated for 1500 full charge cycles with active heat sink.',
        description: 'Powers the heavy-lift Agras T50 through all-day broadacre spraying operations. Water-immersion cooling case allows immediate hot recharging without waiting for cooldown.',
        specs: [
          { label: 'Capacity', value: '30,000 mAh / 1,533 Wh' },
          { label: 'Cycle Warranty', value: '1,500 Full Cycles Guaranteed' }
        ]
      }
    ]
  },
  {
    id: 'dji-agras-t40',
    series: 't40',
    series_name: 'T40',
    name: 'DJI Agras T40 Commercial Agricultural Spraying Drone',
    sku: 'DH-AG-T40',
    brand: 'DJI Agriculture',
    category: 'drones',
    price_cents: 2650000, // $26,500.00 AUD
    stock_qty: 5,
    image_url: '/images/hero-enterprise-drone.jpg',
    short_description: 'Industry-standard 40kg spraying and 50kg spreading agricultural workhorse with omnidirectional active phased array radar.',
    description: 'The proven workhorse of Australian aerial spraying. Equipped with a coaxial twin-rotor design, the T40 delivers high downwash penetration for broadacre crops, pasture, and orchards with dual atomized centrifugal spray nozzles.',
    flight_time: '26 Min Loaded Flight Time',
    ip_rating: 'IPX6K Washable',
    warranty_months: 12,
    casa_note: 'Requires CASA heavy drone endorsement (>25kg MTOW) and chemical application aerial contractor authorization.',
    specs: [
      { label: 'Spreading Payload', value: '50 kg (70L Dry Granule)' },
      { label: 'Spraying Payload', value: '40 kg (Liquid Formulation)' },
      { label: 'Spray Width', value: 'Up to 11 Meters Swath' },
      { label: 'Radar Sensing', value: 'Omnidirectional Phased Array Radar' }
    ],
    parts: [
      {
        id: 'part-t40-nozzles',
        drone_id: 'dji-agras-t40',
        name: 'Agras T40 Centrifugal Dual Atomizing Nozzle Kit',
        sku: 'DH-NOZ-T40',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 38000,
        stock_qty: 25,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Dual atomizing centrifugal nozzles providing uniform droplet size from 50 to 300 microns.',
        description: 'Genuine DJI T40 spray nozzles. Prevents clogged tips and delivers reliable crop droplet adhesion.',
        specs: [
          { label: 'Type', value: 'Dual Centrifugal Atomizing' }
        ]
      },
      {
        id: 'part-t40-props',
        drone_id: 'dji-agras-t40',
        name: 'Agras T40 54-inch Heavy-Duty Carbon Propeller Pair',
        sku: 'DH-PRP-T40',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 26000,
        stock_qty: 35,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'High-strength carbon composite folding propeller blades engineered for high hover efficiency.',
        description: 'Original DJI replacement props balancing aerodynamic efficiency and structural toughness.',
        specs: [
          { label: 'Diameter', value: '54 inches Folding' }
        ]
      },
      {
        id: 'part-t40-pump',
        drone_id: 'dji-agras-t40',
        name: 'Agras T40 Magnetic Drive Impeller Pump',
        sku: 'DH-PMP-T40',
        brand: 'DJI Agriculture',
        category: 'parts',
        price_cents: 79000,
        stock_qty: 14,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Corrosion-proof magnetic drive impeller pump for ag chemicals and liquid fertilizer.',
        description: 'Sealed pump mechanism eliminating motor seal degradation from caustic chemical formulations.',
        specs: [
          { label: 'Output', value: '12 L/min Dual Delivery' }
        ]
      }
    ],
    accessories: [
      {
        id: 'acc-t40-battery',
        drone_id: 'dji-agras-t40',
        name: 'DJI DB1560 Flight Battery for T40 (30,000 mAh)',
        sku: 'DH-BAT-T40-DB1560',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 285000,
        stock_qty: 18,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'High-capacity 30Ah battery delivering reliable power across 1,500 flight cycles.',
        description: 'Fast-charging intelligent flight battery for Agras T40 with water-immersion cooling design.',
        specs: [
          { label: 'Capacity', value: '30,000 mAh' }
        ]
      },
      {
        id: 'acc-t40-spreader',
        drone_id: 'dji-agras-t40',
        name: 'Agras T40 70L Spreading System 3.0',
        sku: 'DH-SPRD-T40',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 220000,
        stock_qty: 7,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: '70L spreading tank with high-torque spinner discs for pasture seed, pasture grasses, and urea.',
        description: 'Quick-attach dry granule hopper system discharging up to 85 kg/min across broadacre fields.',
        specs: [
          { label: 'Capacity', value: '70 Litres (50 kg payload)' }
        ]
      },
      {
        id: 'acc-t40-generator',
        drone_id: 'dji-agras-t40',
        name: 'Agras T40 7200W Multifunction EFI Generator',
        sku: 'DH-GEN-T40',
        brand: 'DJI Agriculture',
        category: 'accessories',
        price_cents: 360000,
        stock_qty: 4,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: '7,200W electronic fuel-injected field generator for fast field battery turnaround.',
        description: 'Fuel-efficient generator for outback Queensland farmers to keep T40 batteries charged all day.',
        specs: [
          { label: 'Power', value: '7,200 Watts EFI' }
        ]
      }
    ]
  },
  {
    id: 'dji-mavic-3-thermal',
    series: 'mavic',
    series_name: 'Mavic',
    name: 'DJI Mavic 3 Enterprise Thermal (3T) Rapid Survey Kit',
    sku: 'DH-M3T-EXP',
    brand: 'DJI Enterprise',
    category: 'drones',
    price_cents: 849900, // $8,499.00 AUD
    stock_qty: 12,
    image_url: '/images/thermal-survey-drone.jpg',
    short_description: 'Ultra-portable 640×512 radiometric thermal camera with 56× hybrid zoom for solar farm inspections, search and rescue, and stockpile scanning.',
    description: 'Compact and portable, the Mavic 3 Thermal can be deployed in under 45 seconds from the boot of a ute. Equipped with a 640×512 thermal imaging sensor, a 48MP wide camera, and a 12MP tele camera supporting 56× hybrid zoom. Features a mechanical shutter on the wide sensor that prevents motion blur during fast high-speed stockpile mapping.',
    flight_time: '45 Min Max Flight Time',
    ip_rating: 'C0 Sub-1kg Compact (920g)',
    warranty_months: 12,
    casa_note: 'Compliant with CASA sub-2kg standard operating conditions when flown within visual line of sight during daylight.',
    specs: [
      { label: 'Thermal Resolution', value: '640 × 512 @ 30fps Radiometric' },
      { label: 'Zoom Camera', value: '12MP Tele, 56× Hybrid Zoom' },
      { label: 'Wide Camera', value: '48MP 1/2-inch CMOS Sensor' },
      { label: 'Max Flight Time', value: '45 Minutes' },
      { label: 'Takeoff Weight', value: '920 grams (Sub-1kg Rapid Deploy)' }
    ],
    // Parts specifically for Mavic 3 Thermal
    parts: [
      {
        id: 'part-m3-props',
        drone_id: 'dji-mavic-3-thermal',
        name: 'Mavic 3 Enterprise Low-Noise Propellers (Set of 4)',
        sku: 'DH-PRP-M3E',
        brand: 'DJI Enterprise',
        category: 'parts',
        price_cents: 6900, // $69.00 AUD
        stock_qty: 60,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Factory dynamic-balanced low-noise replacement propellers with soft tips.',
        description: 'Genuine DJI low-noise props for Mavic 3 Enterprise/Thermal. Flexible aerodynamic tips reduce acoustic footprint and drag.',
        specs: [
          { label: 'Quantity', value: '4 Propellers (2 CW + 2 CCW)' },
          { label: 'Compatibility', value: 'Mavic 3E / Mavic 3T / Mavic 3M' }
        ]
      },
      {
        id: 'part-m3-gimbal-hood',
        drone_id: 'dji-mavic-3-thermal',
        name: 'Mavic 3 Thermal Precision Gimbal Protector Hood',
        sku: 'DH-HOD-M3T',
        brand: 'DJI Enterprise',
        category: 'parts',
        price_cents: 4500, // $45.00 AUD
        stock_qty: 40,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Ruggedized polycarbonate transport lock protecting radiometric thermal lenses.',
        description: 'Snaps over the dual thermal/zoom gimbal assembly to prevent motor calibration drift during rough 4WD transit across mining roads.',
        specs: [
          { label: 'Material', value: 'High-Impact Polycarbonate' }
        ]
      }
    ],
    // Accessories specifically for Mavic 3 Thermal
    accessories: [
      {
        id: 'acc-m3-battery-kit',
        drone_id: 'dji-mavic-3-thermal',
        name: 'Mavic 3 Enterprise Battery Power Kit (3x Batteries + 100W Hub)',
        sku: 'DH-KIT-M3E-BAT',
        brand: 'DJI Enterprise',
        category: 'accessories',
        price_cents: 119900, // $1,199.00 AUD
        stock_qty: 25,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Complete all-day survey power combo with three intelligent flight batteries and a sequential 100W fast charger.',
        description: 'Keep your Mavic 3 Thermal airborne from sunrise to sunset. This kit includes three 5000 mAh batteries and a 100W multi-voltage charging hub.',
        specs: [
          { label: 'Battery Capacity', value: '5,000 mAh each' },
          { label: 'Hub Power', value: '100W Sequential USB-C Fast Charger' },
          { label: 'Airtime Boost', value: '+135 Minutes Combined Extra Airtime' }
        ]
      },
      {
        id: 'acc-m3-rtk',
        drone_id: 'dji-mavic-3-thermal',
        name: 'Mavic 3 Enterprise RTK Centimeter Positioning Module',
        sku: 'DH-MOD-M3-RTK',
        brand: 'DJI Enterprise',
        category: 'accessories',
        price_cents: 145000, // $1,450.00 AUD
        stock_qty: 10,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Top-mount RTK puck delivering centimeter-accurate photogrammetry without ground control points.',
        description: 'Screw-on RTK module for Mavic 3 Enterprise. Enables direct geotagging with centimeter precision for cadastral surveying and mining volume calculations.',
        specs: [
          { label: 'Accuracy', value: '1 cm + 1 ppm (Horizontal)' },
          { label: 'Weight', value: '20 grams' }
        ]
      }
    ]
  },
  {
    id: 'dji-inspire-3',
    series: 'inspire',
    series_name: 'Inspire',
    name: 'DJI Inspire 3 8K Full-Frame Cinema Airframe System',
    sku: 'DH-INS3-CINE',
    brand: 'DJI Pro',
    category: 'drones',
    price_cents: 2399000, // $23,990.00 AUD
    stock_qty: 2,
    image_url: '/images/hero-enterprise-drone.jpg',
    short_description: 'Unprecedented 8K/75fps ProRes RAW aerial cinematography ecosystem with full-frame sensor, centimeter-accurate RTK Waypoint Pro, and dual-operator controls.',
    description: 'The pinnacle of high-end commercial aerial cinematography. Features the custom Zenmuse X9-8K Air Gimbal Camera, dual native ISO, and DJI’s Cinema Color System. Comes as a complete production-ready bundle with 6 TB51 intelligent batteries, dual RC Plus controllers, high-speed PROSSD 1TB, and heavy-duty wheeled flight case.',
    flight_time: '28 Min Max Flight Time',
    ip_rating: 'Aviation Grade Carbon Airframe',
    warranty_months: 24,
    casa_note: 'Classified as medium commercial RPAS (>4kg). Mandatory ReOC pilot license required for commercial filming over public areas.',
    specs: [
      { label: 'Sensor Size', value: 'Full-Frame 35mm CMOS' },
      { label: 'Recording Formats', value: 'Apple ProRes RAW / CinemaDNG' },
      { label: 'Gimbal Orientation', value: '360° Pan & 80° Tilt-Up' },
      { label: 'Repeatable Paths', value: 'RTK Waypoint Pro ±1cm Precision' }
    ],
    // Parts specifically for Inspire 3
    parts: [
      {
        id: 'part-ins3-props',
        drone_id: 'dji-inspire-3',
        name: 'Inspire 3 Quick-Release 1671 Foldable Propellers (Pair)',
        sku: 'DH-PRP-1671',
        brand: 'DJI Pro',
        category: 'parts',
        price_cents: 18900, // $189.00 AUD
        stock_qty: 20,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'High-strength carbon composite quick-release propellers for 8K high-speed chase shots.',
        description: 'Engineered to handle the extreme acceleration and 94 km/h top speeds of the Inspire 3 without flutter.',
        specs: [
          { label: 'Model', value: '1671 Foldable Propellers' },
          { label: 'Material', value: 'Reinforced Carbon Fiber' }
        ]
      }
    ],
    // Accessories specifically for Inspire 3
    accessories: [
      {
        id: 'acc-ins3-prossd',
        drone_id: 'dji-inspire-3',
        name: 'DJI PROSSD 1TB Master Recording Module',
        sku: 'DH-SSD-1TB',
        brand: 'DJI Pro',
        category: 'accessories',
        price_cents: 129900, // $1,299.00 AUD
        stock_qty: 8,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'High-speed NVMe 900MB/s sustained write storage module for ProRes RAW 8K video.',
        description: 'Enables continuous recording of uncompressed CinemaDNG and 8K ProRes RAW footage directly from the X9-8K Air camera.',
        specs: [
          { label: 'Capacity', value: '1 TB High-Speed Storage' },
          { label: 'Read/Write', value: 'Up to 900 MB/s Sustained' }
        ]
      },
      {
        id: 'acc-tb51-battery-pair',
        drone_id: 'dji-inspire-3',
        name: 'DJI TB51 Intelligent Flight Batteries (Matched Pair)',
        sku: 'DH-BAT-TB51-2PK',
        brand: 'DJI Pro',
        category: 'accessories',
        price_cents: 115000, // $1,150.00 AUD
        stock_qty: 14,
        image_url: '/images/drone-parts-accessories.jpg',
        short_description: 'Matched dual-battery pair with automatic self-heating and fast hot-swapping.',
        description: 'Dual TB51 batteries power the Inspire 3 with full avionics redundancy, maintaining 28 minutes of flight time.',
        specs: [
          { label: 'Capacity', value: '4,280 mAh each' },
          { label: 'Quantity', value: '2 Batteries (Matched Pair)' }
        ]
      }
    ]
  }
];

export const COMBOS = [
  {
    id: 'combo-bowen-basin-mining',
    name: 'Bowen Basin Coal Mine Autonomous RTK Survey Combo',
    sku: 'DH-BBN-RTK-BNDL',
    brand: 'DroneHub Engineered',
    category: 'combos',
    price_cents: 3499000, // $34,990.00 AUD
    stock_qty: 3,
    image_url: '/images/hero-enterprise-drone.jpg',
    short_description: 'Turnkey mining stockpile & pit inspection station: Matrice 350 RTK, D-RTK 2 Base Station, H20T Quad-Sensor, 8x TB65 batteries, and heavy-duty Pelican kit.',
    description: 'Designed by our Mackay engineering team specifically for Bowen Basin coal mine contractors. Pre-calibrated, firmware-matched, and flight-tested in Mackay prior to dispatch. When this bundle is purchased, inventory is automatically decremented across all child sub-assemblies.',
    flight_time: 'Continuous Hot-Swappable 8x Batteries',
    ip_rating: 'Mining Complete Turnkey IP55',
    warranty_months: 24,
    casa_note: 'Includes 12 months complimentary CASA digital flight log integration and compliance airworthiness certificate.',
    specs: [
      { label: 'Airframe', value: 'DJI Matrice 350 RTK Enterprise' },
      { label: 'Payload', value: 'Zenmuse H20T Quad-Sensor (Thermal, Zoom, Wide, Laser)' },
      { label: 'Base Station', value: 'D-RTK 2 High-Precision GNSS Tripod Station' },
      { label: 'Batteries Included', value: '8x TB65 Intelligent Flight Batteries' },
      { label: 'Transport Case', value: 'Custom CNC Foam Waterproof Pelican Trunk' }
    ]
  },
  {
    id: 'combo-inspire3-cinema',
    name: 'DJI Inspire 3 8K Cinema Master Production Combo',
    sku: 'DH-INS3-BUNDLE',
    brand: 'DJI Pro',
    category: 'combos',
    price_cents: 2999000, // $29,990.00 AUD
    stock_qty: 2,
    image_url: '/images/hero-enterprise-drone.jpg',
    short_description: 'Complete dual-operator feature film cinema bundle with Inspire 3, X9-8K Air camera, 6x TB51 batteries, dual RC Plus remotes, and 2TB SSD.',
    description: 'Everything an Australian film production crew needs to shoot 8K ProRes RAW. Delivered in a heavy-duty custom transport case with dual pilots configured.',
    flight_time: '28 Min per battery set',
    ip_rating: 'Cinema Aviation Grade',
    warranty_months: 24,
    casa_note: 'Complies with CASR Part 101 heavy commercial aerial filming requirements.',
    specs: [
      { label: 'Camera', value: 'Zenmuse X9-8K Air Full-Frame' },
      { label: 'Controllers', value: '2x DJI RC Plus Pro Cine Monitors' },
      { label: 'Storage', value: '2x DJI PROSSD 1TB Master Cards' },
      { label: 'Batteries', value: '6x TB51 Intelligent Flight Batteries' }
    ]
  },
  {
    id: 'combo-mavic3-bushfire',
    name: 'Mavic 3 Thermal Bushfire & Solar Farm Rapid Response Combo',
    sku: 'DH-M3T-COMBO',
    brand: 'DJI Enterprise',
    category: 'combos',
    price_cents: 1089000, // $10,890.00 AUD
    stock_qty: 8,
    image_url: '/images/thermal-survey-drone.jpg',
    short_description: 'Rapid field deployment kit: Mavic 3 Thermal, 4x batteries, 100W car/mains hub, RTK centimeter module, and rugged field backpack.',
    description: 'Designed for rural fire brigades, council inspectors, and solar maintenance crews. Keep flying all day with fast vehicle recharging.',
    flight_time: 'Up to 180 Min Combined Rotation',
    ip_rating: 'Sub-1kg Rapid Deploy',
    warranty_months: 12,
    casa_note: 'Sub-2kg standard operating conditions apply. Easy CASA notification.',
    specs: [
      { label: 'Thermal Sensor', value: '640 × 512 Radiometric Thermal' },
      { label: 'Batteries', value: '4x Intelligent Flight Batteries (5000 mAh)' },
      { label: 'RTK Module', value: 'Included Screw-On RTK Centimeter Module' },
      { label: 'Charger', value: '100W Fast Hub with 12V Vehicle Adapter' }
    ]
  }
];

// Helper to get all individual parts flattened
export const getAllParts = () => {
  return DRONES.flatMap(d => d.parts);
};

// Helper to get all individual accessories flattened
export const getAllAccessories = () => {
  return DRONES.flatMap(d => d.accessories);
};

// Helper to get all products flattened for catalog search / lookup
export const getAllProducts = () => {
  const parts = getAllParts();
  const accessories = getAllAccessories();
  return [...DRONES, ...COMBOS, ...parts, ...accessories];
};

// Format cents to AUD string ($14,999.00 AUD)
export const formatAud = (cents) => {
  return '$' + (cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Australian GST breakdown (10% inclusive: GST = Total / 11)
export const calculateGst = (cents) => {
  return Math.round(cents / 11);
};
