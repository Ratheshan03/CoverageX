#!/bin/bash

# API Testing Script for CoverageX To-Do Backend
# This script tests all API endpoints

BASE_URL="http://localhost:5000"

echo "========================================="
echo "CoverageX To-Do API Testing"
echo "========================================="
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -X GET "${BASE_URL}/health" | json_pp
echo -e "\n"

# Test 2: Get Initial Tasks (should show sample data)
echo "2. Getting initial tasks..."
curl -X GET "${BASE_URL}/api/tasks" | json_pp
echo -e "\n"

# Test 3: Create New Task
echo "3. Creating new task - 'Test from API'..."
curl -X POST "${BASE_URL}/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test from API",
    "description": "This task was created via curl command to test the API"
  }' | json_pp
echo -e "\n"

# Test 4: Create Another Task
echo "4. Creating another task - 'Complete backend testing'..."
curl -X POST "${BASE_URL}/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete backend testing",
    "description": "Test all CRUD operations on the backend API"
  }' | json_pp
echo -e "\n"

# Test 5: Get Tasks Again (should show new tasks)
echo "5. Getting all tasks (should include new tasks)..."
curl -X GET "${BASE_URL}/api/tasks" | json_pp
echo -e "\n"

# Test 6: Mark Task as Complete (ID 1)
echo "6. Marking task ID 1 as completed..."
curl -X PATCH "${BASE_URL}/api/tasks/1/complete" | json_pp
echo -e "\n"

# Test 7: Get Tasks After Completion (task 1 should be gone)
echo "7. Getting tasks after marking one complete..."
curl -X GET "${BASE_URL}/api/tasks" | json_pp
echo -e "\n"

# Test 8: Test Validation - Empty Title
echo "8. Testing validation - empty title (should fail)..."
curl -X POST "${BASE_URL}/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "description": "This should fail validation"
  }' | json_pp
echo -e "\n"

# Test 9: Test Validation - Missing Description
echo "9. Testing validation - missing description (should fail)..."
curl -X POST "${BASE_URL}/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task without description"
  }' | json_pp
echo -e "\n"

# Test 10: Test 404 - Complete Non-existent Task
echo "10. Testing 404 - complete non-existent task..."
curl -X PATCH "${BASE_URL}/api/tasks/9999/complete" | json_pp
echo -e "\n"

echo "========================================="
echo "Testing Complete!"
echo "========================================="
