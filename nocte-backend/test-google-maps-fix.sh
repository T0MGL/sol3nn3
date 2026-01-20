#!/bin/bash

# Test script to verify Google Maps URL handling
# This tests that we DON'T send random/fake Google Maps links to Ordefy
# when the user manually types their address

echo "🧪 Testing Google Maps URL handling..."
echo "======================================"
echo ""

BASE_URL="http://localhost:3000"

# Test Case 1: User provides GPS coordinates (should send google_maps_url)
echo "Test 1: GPS Coordinates (should include google_maps_url)"
echo "--------------------------------------------------------"
curl -s -X POST ${BASE_URL}/api/send-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User GPS",
    "phone": "+595981234567",
    "location": "Asunción",
    "address": "Av. Mariscal López 123",
    "lat": -25.2637,
    "long": -57.5759,
    "quantity": 1,
    "total": 199000,
    "orderNumber": "#TEST-GPS-001",
    "paymentType": "COD",
    "deliveryType": "común"
  }' | jq '.ordefyResponse'

echo ""
echo ""

# Test Case 2: User types address manually (should NOT send google_maps_url)
echo "Test 2: Manual Address (should NOT include google_maps_url)"
echo "------------------------------------------------------------"
curl -s -X POST ${BASE_URL}/api/send-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User Manual",
    "phone": "+595981234567",
    "location": "Asunción",
    "address": "Av. España 456",
    "quantity": 1,
    "total": 199000,
    "orderNumber": "#TEST-MANUAL-001",
    "paymentType": "COD",
    "deliveryType": "común"
  }' | jq '.ordefyResponse'

echo ""
echo ""

# Test Case 3: User provides coordinate-based Google Maps link
echo "Test 3: Coordinate-based Google Maps Link (should include google_maps_url)"
echo "---------------------------------------------------------------------------"
curl -s -X POST ${BASE_URL}/api/send-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User Link",
    "phone": "+595981234567",
    "location": "Asunción",
    "address": "Av. Eusebio Ayala 789",
    "googleMapsLink": "https://www.google.com/maps?q=-25.2637,-57.5759",
    "quantity": 1,
    "total": 199000,
    "orderNumber": "#TEST-LINK-001",
    "paymentType": "COD",
    "deliveryType": "común"
  }' | jq '.ordefyResponse'

echo ""
echo ""

# Test Case 4: Search-based Google Maps link (should NOT send to Ordefy)
echo "Test 4: Search-based Google Maps Link (should NOT include google_maps_url)"
echo "---------------------------------------------------------------------------"
curl -s -X POST ${BASE_URL}/api/send-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User Search",
    "phone": "+595981234567",
    "location": "Asunción",
    "address": "Av. Brasilia 321",
    "googleMapsLink": "https://www.google.com/maps/search/?api=1&query=Asuncion+Paraguay",
    "quantity": 1,
    "total": 199000,
    "orderNumber": "#TEST-SEARCH-001",
    "paymentType": "COD",
    "deliveryType": "común"
  }' | jq '.ordefyResponse'

echo ""
echo ""
echo "✅ Test completed!"
echo ""
echo "Expected Results:"
echo "  Test 1: Should show google_maps_url with coordinates"
echo "  Test 2: Should show address/city fields, NO google_maps_url"
echo "  Test 3: Should show google_maps_url with coordinates"
echo "  Test 4: Should show address/city fields, NO google_maps_url"
