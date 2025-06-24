/**
 * Concept Examples Module
 * Provides example code for different programming concepts
 * Version: 2.0 (fixed)
 * Last updated: May 7, 2025
 */

// Debug message
console.log("ConceptExamples.js module loaded");

/**
 * Get real-world examples for a given concept and language
 * @param {string} concept - The programming concept
 * @param {string} language - The programming language
 * @returns {object} Real-world example with title, description and code
 */
export function getRealWorldExample(concept, language = 'python') {
    const examples = {
        'if-else': {
            title: 'User Authentication System',
            description: 'This login/signup system uses if-else statements to validate user credentials and handle different authentication scenarios.',
            code: {
                python: `# User Authentication System with if-else statements
from flask import Flask, request, redirect, session, render_template

app = Flask(__name__)
app.secret_key = "your_secret_key"

# Simple user database (in real world, this would be a database)
users = {
    "user@example.com": {"password": "securepass123", "name": "Test User"}
}

@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        
        # Check if email exists
        if email in users:
            # Check if password matches
            if password == users[email]["password"]:
                # Authentication successful
                session["user"] = email
                return redirect("/dashboard")
            else:
                # Password incorrect
                error = "Incorrect password"
        else:
            # Email not found
            error = "Email not registered"
    
    # If GET request or authentication failed, show login form
    return render_template("login.html", error=error)

@app.route("/signup", methods=["GET", "POST"])
def signup():
    error = None
    
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        confirm = request.form.get("confirm_password")
        name = request.form.get("name")
        
        # Validate input fields
        if not all([email, password, confirm, name]):
            error = "All fields are required"
        elif email in users:
            error = "Email already registered"
        elif password != confirm:
            error = "Passwords do not match"
        elif len(password) < 8:
            error = "Password must be at least 8 characters"
        else:
            # Create new user
            users[email] = {"password": password, "name": name}
            session["user"] = email
            return redirect("/dashboard")
    
    # If GET request or validation failed, show signup form
    return render_template("signup.html", error=error)`,
                
                javascript: `// User Authentication System with if-else statements
const express = require('express');
const app = express();
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Simple user database (in real world, this would be a database)
const users = {
  "user@example.com": { password: "securepass123", name: "Test User" }
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  let error = null;
  
  // Check if email exists
  if (email in users) {
    // Check if password matches
    if (password === users[email].password) {
      // Authentication successful
      req.session.user = email;
      return res.redirect('/dashboard');
    } else {
      // Password incorrect
      error = "Incorrect password";
    }
  } else {
    // Email not found
    error = "Email not registered";
  }
  
  // Authentication failed, show login form with error
  res.render('login', { error });
});

app.post('/signup', (req, res) => {
  const { email, password, confirm_password, name } = req.body;
  let error = null;
  
  // Validate input fields
  if (!email || !password || !confirm_password || !name) {
    error = "All fields are required";
  } else if (email in users) {
    error = "Email already registered";
  } else if (password !== confirm_password) {
    error = "Passwords do not match";
  } else if (password.length < 8) {
    error = "Password must be at least 8 characters";
  } else {
    // Create new user
    users[email] = { password, name };
    req.session.user = email;
    return res.redirect('/dashboard');
  }
  
  // Validation failed, show signup form with error
  res.render('signup', { error });
});`
            }
        },
        'loops': {
            title: 'Data Processing Pipeline',
            description: 'This data processing system uses loops to process records from a dataset.',
            code: {
                python: `# Data Processing Pipeline with loops
import csv
import statistics

def process_data(file_path):
    """Process sales data from a CSV file"""
    sales_data = []
    
    # Read data from CSV file using a for loop
    with open(file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Convert string values to appropriate types
            processed_row = {
                'date': row['date'],
                'product_id': row['product_id'],
                'category': row['category'],
                'quantity': int(row['quantity']),
                'price': float(row['price']),
                'total': float(row['price']) * int(row['quantity'])
            }
            sales_data.append(processed_row)
    
    # Process data by category
    category_totals = {}
    category_quantities = {}
    category_average_price = {}
    
    # Use a for loop to calculate statistics for each category
    for sale in sales_data:
        category = sale['category']
        
        # Initialize category in dictionaries if not present
        if category not in category_totals:
            category_totals[category] = 0
            category_quantities[category] = 0
            category_average_price[category] = []
        
        # Update counters
        category_totals[category] += sale['total']
        category_quantities[category] += sale['quantity']
        category_average_price[category].append(sale['price'])
    
    # Calculate average price for each category
    for category in category_average_price:
        category_average_price[category] = statistics.mean(category_average_price[category])
    
    return {
        'sales_data': sales_data,
        'category_totals': category_totals,
        'category_quantities': category_quantities,
        'category_average_price': category_average_price
    }

# Usage example
results = process_data('sales_data.csv')
print("Total sales by category:")
for category, total in results['category_totals'].items():
    print(f"{category}: ${total:.2f}")

print("\\nAverage price by category:")
for category, avg in results['category_average_price'].items():
    print(f"{category}: ${avg:.2f}")`,
                
                javascript: `// Data Processing Pipeline with loops
const fs = require('fs');
const csv = require('csv-parser');

function processData(filePath) {
  return new Promise((resolve, reject) => {
    const salesData = [];
    
    // Read data from CSV file using a stream and for-each loop
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Convert string values to appropriate types
        const processedRow = {
          date: row.date,
          product_id: row.product_id,
          category: row.category,
          quantity: parseInt(row.quantity),
          price: parseFloat(row.price),
          total: parseFloat(row.price) * parseInt(row.quantity)
        };
        salesData.push(processedRow);
      })
      .on('end', () => {
        // Process data by category
        const categoryTotals = {};
        const categoryQuantities = {};
        const categoryAveragePrice = {};
        
        // Use a for-of loop to calculate statistics for each category
        for (const sale of salesData) {
          const category = sale.category;
          
          // Initialize category in objects if not present
          if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
            categoryQuantities[category] = 0;
            categoryAveragePrice[category] = [];
          }
          
          // Update counters
          categoryTotals[category] += sale.total;
          categoryQuantities[category] += sale.quantity;
          categoryAveragePrice[category].push(sale.price);
        }
        
        // Calculate average price for each category
        for (const category in categoryAveragePrice) {
          const prices = categoryAveragePrice[category];
          categoryAveragePrice[category] = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        }
        
        resolve({
          salesData,
          categoryTotals,
          categoryQuantities,
          categoryAveragePrice
        });
      })
      .on('error', reject);
  });
}

// Usage example
async function main() {
  try {
    const results = await processData('sales_data.csv');
    
    console.log('Total sales by category:');
    for (const [category, total] of Object.entries(results.categoryTotals)) {
      console.log(`${category}: $${total.toFixed(2)}`);
    }
    
    console.log('\\nAverage price by category:');
    for (const [category, avg] of Object.entries(results.categoryAveragePrice)) {
      console.log(`${category}: $${avg.toFixed(2)}`);
    }
  } catch (error) {
    console.error('Error processing data:', error);
  }
}

main();`
            }
        },
        'functions': {
            title: 'Task Management System',
            description: 'This task management system uses functions to organize and manipulate task data.',
            code: {
                python: `# Task Management System with functions
from datetime import datetime, timedelta

# Task storage
tasks = []

def add_task(title, description, due_date=None, priority="medium", tags=None):
    """
    Add a new task to the task list
    
    Args:
        title (str): Task title
        description (str): Task description
        due_date (str, optional): Due date in format 'YYYY-MM-DD'
        priority (str, optional): Priority level (low, medium, high)
        tags (list, optional): List of tags
        
    Returns:
        dict: The newly created task
    """
    # Validate inputs
    if not title:
        raise ValueError("Task title is required")
    
    # Set default values
    if tags is None:
        tags = []
    
    # Parse due date
    parsed_due_date = None
    if due_date:
        try:
            parsed_due_date = datetime.strptime(due_date, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Due date must be in format 'YYYY-MM-DD'")
    
    # Create task object
    task = {
        "id": len(tasks) + 1,
        "title": title,
        "description": description,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "due_date": parsed_due_date,
        "priority": priority,
        "tags": tags,
        "completed": False
    }
    
    # Add to task list
    tasks.append(task)
    return task

def get_task(task_id):
    """
    Get a task by its ID
    
    Args:
        task_id (int): The task ID to find
        
    Returns:
        dict: The found task or None
    """
    for task in tasks:
        if task["id"] == task_id:
            return task
    return None

def update_task(task_id, **kwargs):
    """
    Update a task's properties
    
    Args:
        task_id (int): The task ID to update
        **kwargs: Any task properties to update
        
    Returns:
        dict: The updated task or None if not found
    """
    task = get_task(task_id)
    if task:
        # Update provided properties
        for key, value in kwargs.items():
            if key in task and key not in ["id", "created_at"]:
                task[key] = value
        
        # Update the 'updated_at' timestamp
        task["updated_at"] = datetime.now()
        return task
    return None

def delete_task(task_id):
    """
    Delete a task by its ID
    
    Args:
        task_id (int): The task ID to delete
        
    Returns:
        bool: True if deleted, False if not found
    """
    task = get_task(task_id)
    if task:
        tasks.remove(task)
        return True
    return False

def complete_task(task_id):
    """
    Mark a task as completed
    
    Args:
        task_id (int): The task ID to complete
        
    Returns:
        dict: The updated task or None
    """
    return update_task(task_id, completed=True)

def get_tasks_by_tag(tag):
    """
    Find all tasks with a specific tag
    
    Args:
        tag (str): The tag to search for
        
    Returns:
        list: List of matching tasks
    """
    return [task for task in tasks if tag in task["tags"]]

def get_overdue_tasks():
    """
    Get all tasks that are past their due date and not completed
    
    Returns:
        list: List of overdue tasks
    """
    today = datetime.now().date()
    return [
        task for task in tasks 
        if task["due_date"] and task["due_date"] < today and not task["completed"]
    ]

# Example usage
add_task(
    "Complete project proposal", 
    "Write up the project proposal for the client meeting",
    "2023-05-15",
    "high",
    ["work", "client"]
)

add_task(
    "Buy groceries",
    "Milk, eggs, bread, fruits",
    "2023-05-10",
    "medium",
    ["personal", "shopping"]
)

add_task(
    "Schedule team meeting",
    "Arrange weekly team sync",
    "2023-05-12",
    "high",
    ["work", "team"]
)

# Mark a task as complete
complete_task(2)

# Update a task
update_task(1, description="Revise and complete the project proposal", priority="high")

# Find tasks by tag
work_tasks = get_tasks_by_tag("work")
print(f"Work-related tasks: {len(work_tasks)}")

# Find overdue tasks
overdue = get_overdue_tasks()
print(f"Overdue tasks: {len(overdue)}")

# Print all tasks
for task in tasks:
    status = "✅" if task["completed"] else "⏳"
    print(f"{status} [{task['priority']}] {task['title']} (Due: {task['due_date']})")`
            }
        },
        'oops': {
            title: 'Vehicle Management System',
            description: 'This object-oriented system manages different types of vehicles with inheritance.',
            code: {
                python: `# Vehicle Management System using OOP principles
from datetime import datetime
from abc import ABC, abstractmethod

class Vehicle(ABC):
    """Base class for all vehicles"""
    
    def __init__(self, make, model, year, vin):
        self.make = make
        self.model = model
        self.year = year
        self.vin = vin
        self.is_running = False
        self.current_speed = 0
        self.maintenance_history = []
    
    def start_engine(self):
        """Start the vehicle's engine"""
        if not self.is_running:
            self.is_running = True
            return f"{self.make} {self.model}'s engine started"
        return f"{self.make} {self.model}'s engine is already running"
    
    def stop_engine(self):
        """Stop the vehicle's engine"""
        if self.is_running:
            self.is_running = False
            self.current_speed = 0
            return f"{self.make} {self.model}'s engine stopped"
        return f"{self.make} {self.model}'s engine is already off"
    
    def accelerate(self, speed_increase):
        """Increase the vehicle's speed"""
        if self.is_running:
            self.current_speed += speed_increase
            return f"{self.make} {self.model} accelerated to {self.current_speed} km/h"
        return f"Cannot accelerate - {self.make} {self.model}'s engine is not running"
    
    def brake(self, speed_decrease):
        """Decrease the vehicle's speed"""
        if self.current_speed > 0:
            self.current_speed = max(0, self.current_speed - speed_decrease)
            return f"{self.make} {self.model} slowed down to {self.current_speed} km/h"
        return f"{self.make} {self.model} is already stopped"
    
    def add_maintenance_record(self, service_type, description):
        """Add a maintenance record"""
        record = {
            "date": datetime.now(),
            "service_type": service_type,
            "description": description
        }
        self.maintenance_history.append(record)
        return f"Maintenance record added for {self.make} {self.model}"
    
    @abstractmethod
    def get_fuel_efficiency(self):
        """Calculate fuel efficiency - must be implemented by subclasses"""
        pass
    
    def __str__(self):
        return f"{self.year} {self.make} {self.model} (VIN: {self.vin})"


class Car(Vehicle):
    """Car class that extends Vehicle"""
    
    def __init__(self, make, model, year, vin, num_doors, fuel_capacity, fuel_level=0):
        super().__init__(make, model, year, vin)
        self.num_doors = num_doors
        self.fuel_capacity = fuel_capacity
        self.fuel_level = fuel_level
        self.is_trunk_open = False
    
    def open_trunk(self):
        """Open the car's trunk"""
        if not self.is_trunk_open:
            self.is_trunk_open = True
            return f"{self.make} {self.model}'s trunk opened"
        return f"{self.make} {self.model}'s trunk is already open"
    
    def close_trunk(self):
        """Close the car's trunk"""
        if self.is_trunk_open:
            self.is_trunk_open = False
            return f"{self.make} {self.model}'s trunk closed"
        return f"{self.make} {self.model}'s trunk is already closed"
    
    def get_fuel_efficiency(self):
        """Calculate fuel efficiency for a car"""
        # This would normally be based on various factors
        base_efficiency = 10  # 10 km/l
        age_factor = 0.1 * (datetime.now().year - self.year)
        return max(5, base_efficiency - age_factor)
    
    def refuel(self, amount):
        """Add fuel to the car"""
        if amount <= 0:
            return "Refuel amount must be positive"
        
        new_level = min(self.fuel_capacity, self.fuel_level + amount)
        added = new_level - self.fuel_level
        self.fuel_level = new_level
        
        return f"Added {added:.1f}L of fuel. Current level: {self.fuel_level:.1f}L/{self.fuel_capacity}L"


class ElectricCar(Car):
    """Electric Car class that extends Car"""
    
    def __init__(self, make, model, year, vin, num_doors, battery_capacity, battery_level=0):
        # Set fuel capacity and level to 0 for electric cars
        super().__init__(make, model, year, vin, num_doors, 0, 0)
        self.battery_capacity = battery_capacity  # in kWh
        self.battery_level = battery_level  # percentage
    
    def get_fuel_efficiency(self):
        """Calculate equivalent fuel efficiency for an electric car"""
        # Electric cars use kWh instead of fuel, so this is an equivalent
        base_efficiency = 25  # 25 km/kWh
        age_factor = 0.05 * (datetime.now().year - self.year)
        return max(15, base_efficiency - age_factor)
    
    def charge(self, amount):
        """Charge the electric car's battery"""
        if amount <= 0:
            return "Charge amount must be positive"
        
        new_level = min(100, self.battery_level + amount)
        added = new_level - self.battery_level
        self.battery_level = new_level
        
        return f"Added {added:.1f}% charge. Current battery: {self.battery_level:.1f}%"
    
    def refuel(self, amount):
        """Override to prevent refueling an electric car"""
        return "Electric cars cannot be refueled with gasoline"


class Motorcycle(Vehicle):
    """Motorcycle class that extends Vehicle"""
    
    def __init__(self, make, model, year, vin, type_category, fuel_capacity, fuel_level=0):
        super().__init__(make, model, year, vin)
        self.type_category = type_category  # sport, cruiser, touring, etc.
        self.fuel_capacity = fuel_capacity
        self.fuel_level = fuel_level
        self.kickstand_down = True
    
    def kickstand_up(self):
        """Raise the kickstand"""
        if self.kickstand_down:
            self.kickstand_down = False
            return f"{self.make} {self.model}'s kickstand raised"
        return f"{self.make} {self.model}'s kickstand is already up"
    
    def kickstand_down(self):
        """Lower the kickstand"""
        if not self.kickstand_down:
            self.kickstand_down = True
            return f"{self.make} {self.model}'s kickstand lowered"
        return f"{self.make} {self.model}'s kickstand is already down"
    
    def wheelie(self):
        """Perform a wheelie if conditions are right"""
        if self.is_running and self.current_speed > 20:
            return f"Performing a wheelie on the {self.make} {self.model}!"
        return f"Cannot perform wheelie - speed must be greater than 20 km/h"
    
    def get_fuel_efficiency(self):
        """Calculate fuel efficiency for a motorcycle"""
        # Motorcycles generally have better fuel efficiency than cars
        base_efficiency = 18  # 18 km/l
        age_factor = 0.08 * (datetime.now().year - self.year)
        return max(12, base_efficiency - age_factor)
    
    def refuel(self, amount):
        """Add fuel to the motorcycle"""
        if amount <= 0:
            return "Refuel amount must be positive"
        
        new_level = min(self.fuel_capacity, self.fuel_level + amount)
        added = new_level - self.fuel_level
        self.fuel_level = new_level
        
        return f"Added {added:.1f}L of fuel. Current level: {self.fuel_level:.1f}L/{self.fuel_capacity}L"


# Example usage
my_car = Car("Toyota", "Camry", 2020, "ABC123456DEF", 4, 60, 20)
my_electric = ElectricCar("Tesla", "Model 3", 2021, "XYZ987654ABC", 4, 75, 50)
my_bike = Motorcycle("Honda", "CBR600", 2019, "123XYZ456ABC", "sport", 18, 5)

# Test the car
print(my_car)
print(my_car.start_engine())
print(my_car.accelerate(50))
print(my_car.get_fuel_efficiency())
print(my_car.refuel(30))
print(my_car.brake(20))
print(my_car.open_trunk())
print(my_car.stop_engine())

# Test the electric car
print(my_electric)
print(my_electric.start_engine())
print(my_electric.accelerate(70))
print(my_electric.get_fuel_efficiency())
print(my_electric.charge(25))
print(my_electric.refuel(30))  # Should show error message

# Test the motorcycle
print(my_bike)
print(my_bike.start_engine())
print(my_bike.accelerate(30))
print(my_bike.wheelie())
print(my_bike.get_fuel_efficiency())
print(my_bike.refuel(10))`
            }
        }
    };

    return examples[concept] || null;
}

/**
 * Get concept descriptions and contextual information
 * @param {string} concept - The programming concept
 * @returns {object} Concept description with title, description and real-world uses
 */
export function getConceptDescription(concept) {
    const descriptions = {
        'if-else': {
            title: 'Conditional Logic with If-Else Statements',
            description: 'If-else statements allow programs to make decisions based on conditions. They execute different blocks of code depending on whether a condition is true or false.',
            realWorldUse: 'Used in user authentication, form validation, error handling, and any situation where a program needs to make decisions based on different conditions.'
        },
        'loops': {
            title: 'Iterative Processing with Loops',
            description: 'Loops allow you to execute a block of code repeatedly. The two main types are for loops (definite iteration) and while loops (indefinite iteration).',
            realWorldUse: 'Used in data processing, search algorithms, batch operations, and any task that requires repeating actions over a collection of items.'
        },
        'functions': {
            title: 'Modular Code with Functions',
            description: 'Functions are reusable blocks of code that perform specific tasks. They help organize code, reduce repetition, and improve maintainability.',
            realWorldUse: 'Used throughout programming to create modular, maintainable code. Examples include API handlers, data transformations, utility operations, and encapsulated business logic.'
        },
        'oops': {
            title: 'Object-Oriented Programming',
            description: 'OOP is a programming paradigm based on objects that contain data and code. The four main principles are encapsulation, inheritance, polymorphism, and abstraction.',
            realWorldUse: 'Used in large software systems, game development, GUI applications, and any complex system that can be modeled as interacting objects.'
        },
        'recursion': {
            title: 'Self-Referential Solutions with Recursion',
            description: 'Recursion is a technique where a function calls itself to solve smaller instances of the same problem until a base case is reached.',
            realWorldUse: 'Used in algorithms for tree traversal, graph searching, solving mathematical problems like factorial or Fibonacci series, and divide-and-conquer algorithms.'
        },
        'data-structures': {
            title: 'Organizing Data with Data Structures',
            description: 'Data structures are specialized formats for organizing and storing data, each with different efficiency characteristics for various operations.',
            realWorldUse: 'Used throughout programming for efficient data storage and retrieval. Examples include arrays for sequential data, hashmaps for key-value lookups, stacks for LIFO operations, and trees for hierarchical data.'
        }
    };

    return descriptions[concept] || {
        title: concept.charAt(0).toUpperCase() + concept.slice(1),
        description: "A fundamental programming concept.",
        realWorldUse: "Used in various software development scenarios."
    };
}

/**
 * Get example code for a given concept and language
 * @param {string} concept - The programming concept
 * @param {string} language - The programming language
 * @returns {string} Example code for the concept
 */
export function getConceptExamples(concept, language = 'python') {
    console.log(`Getting concept examples for ${concept} in ${language}`);
    
    const examples = {
        'if-else': {
            python: `# Example of if-else statements in Python
def check_temperature(temp):
    """
    Check the temperature and return a message based on the value
    """
    if temp > 30:
        return "It's hot outside! Remember to stay hydrated."
    elif temp > 20:
        return "The weather is pleasant today."
    elif temp > 10:
        return "It's a bit cool. Maybe bring a light jacket."
    else:
        return "It's cold! You should wear a warm coat."

# Test with different temperatures
print(check_temperature(35))  # Hot
print(check_temperature(25))  # Pleasant
print(check_temperature(15))  # Cool
print(check_temperature(5))   # Cold`,

            javascript: `// Example of if-else statements in JavaScript
function checkTemperature(temp) {
  /*
   * Check the temperature and return a message based on the value
   */
  if (temp > 30) {
    return "It's hot outside! Remember to stay hydrated.";
  } else if (temp > 20) {
    return "The weather is pleasant today.";
  } else if (temp > 10) {
    return "It's a bit cool. Maybe bring a light jacket.";
  } else {
    return "It's cold! You should wear a warm coat.";
  }
}

// Test with different temperatures
console.log(checkTemperature(35));  // Hot
console.log(checkTemperature(25));  // Pleasant
console.log(checkTemperature(15));  // Cool
console.log(checkTemperature(5));   // Cold`,

            java: `// Example of if-else statements in Java
public class TemperatureChecker {
    /**
     * Check the temperature and return a message based on the value
     */
    public static String checkTemperature(int temp) {
        if (temp > 30) {
            return "It's hot outside! Remember to stay hydrated.";
        } else if (temp > 20) {
            return "The weather is pleasant today.";
        } else if (temp > 10) {
            return "It's a bit cool. Maybe bring a light jacket.";
        } else {
            return "It's cold! You should wear a warm coat.";
        }
    }
    
    public static void main(String[] args) {
        // Test with different temperatures
        System.out.println(checkTemperature(35));  // Hot
        System.out.println(checkTemperature(25));  // Pleasant
        System.out.println(checkTemperature(15));  // Cool
        System.out.println(checkTemperature(5));   // Cold
    }
}`
        },
        'loops': {
            python: `# Examples of loops in Python

# For loop example - iterating over a list
fruits = ["apple", "banana", "cherry", "date", "elderberry"]
print("Fruits in my basket:")
for fruit in fruits:
    print(f"- {fruit}")

# While loop example - counting down
print("\\nLaunch countdown:")
countdown = 5
while countdown > 0:
    print(f"{countdown}...")
    countdown -= 1
print("Blast off!")

# Using range() with for loop
print("\\nSquare numbers from 1 to 5:")
for i in range(1, 6):
    print(f"{i} squared is {i**2}")

# Nested loops - multiplication table
print("\\nMultiplication table (1-5):")
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i} × {j} = {i*j}")
    print("---")  # Separator between rows`,

            javascript: `// Examples of loops in JavaScript

// For loop example - iterating over an array
const fruits = ["apple", "banana", "cherry", "date", "elderberry"];
console.log("Fruits in my basket:");
for (let i = 0; i < fruits.length; i++) {
  console.log(\`- \${fruits[i]}\`);
}

// For...of loop (ES6) - modern way to iterate
console.log("\\nFruits using for...of:");
for (const fruit of fruits) {
  console.log(\`- \${fruit}\`);
}

// While loop example - counting down
console.log("\\nLaunch countdown:");
let countdown = 5;
while (countdown > 0) {
  console.log(\`\${countdown}...\`);
  countdown--;
}
console.log("Blast off!");

// For loop with traditional syntax
console.log("\\nSquare numbers from 1 to 5:");
for (let i = 1; i <= 5; i++) {
  console.log(\`\${i} squared is \${i**2}\`);
}

// Nested loops - multiplication table
console.log("\\nMultiplication table (1-5):");
for (let i = 1; i <= 5; i++) {
  for (let j = 1; j <= 5; j++) {
    console.log(\`\${i} × \${j} = \${i*j}\`);
  }
  console.log("---");  // Separator between rows
}`
        },
        'functions': {
            python: `# Examples of functions in Python

# Basic function with no parameters or return value
def greet():
    """A simple greeting function"""
    print("Hello, world!")

# Function with parameters
def personalized_greeting(name):
    """Greet a specific person
    
    Args:
        name (str): The person's name
    """
    print(f"Hello, {name}!")

# Function with parameters and return value
def add(a, b):
    """Add two numbers together
    
    Args:
        a (number): First number
        b (number): Second number
        
    Returns:
        number: The sum of a and b
    """
    return a + b

# Function with default parameter values
def power(base, exponent=2):
    """Calculate the power of a number
    
    Args:
        base (number): The base number
        exponent (number, optional): The exponent (default is 2)
        
    Returns:
        number: The result of base raised to exponent
    """
    return base ** exponent

# Function with arbitrary arguments
def sum_all(*args):
    """Sum any number of arguments
    
    Args:
        *args: Arbitrary positional arguments
        
    Returns:
        number: The sum of all arguments
    """
    return sum(args)

# Function with keyword arguments
def build_profile(first_name, last_name, **user_info):
    """Build a user profile dictionary
    
    Args:
        first_name (str): User's first name
        last_name (str): User's last name
        **user_info: Arbitrary keyword arguments for additional user info
        
    Returns:
        dict: User profile information
    """
    profile = {
        'first_name': first_name,
        'last_name': last_name
    }
    
    # Add any additional key-value pairs
    for key, value in user_info.items():
        profile[key] = value
        
    return profile

# Testing the functions
greet()

personalized_greeting("Alice")

result = add(5, 3)
print(f"5 + 3 = {result}")

# Using the power function
print(f"2² = {power(2)}")
print(f"2³ = {power(2, 3)}")

# Using the sum_all function
print(f"Sum of 1,2,3,4,5 = {sum_all(1, 2, 3, 4, 5)}")

# Using the build_profile function
user = build_profile("John", "Doe", 
                    age=30, 
                    occupation="Developer",
                    location="New York")
print("User profile:", user)`,

            javascript: `// Examples of functions in JavaScript

// Basic function with no parameters or return value
function greet() {
  console.log("Hello, world!");
}

// Function with parameters
function personalizedGreeting(name) {
  console.log(\`Hello, \${name}!\`);
}

// Function with parameters and return value
function add(a, b) {
  return a + b;
}

// Arrow function (ES6)
const subtract = (a, b) => a - b;

// Function with default parameter values (ES6)
function power(base, exponent = 2) {
  return base ** exponent;
}

// Function with rest parameters (ES6)
function sumAll(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

// Higher-order function example
function applyOperation(a, b, operationFn) {
  return operationFn(a, b);
}

// Testing the functions
greet();

personalizedGreeting("Alice");

const result = add(5, 3);
console.log(\`5 + 3 = \${result}\`);

// Using the arrow function
console.log(\`10 - 4 = \${subtract(10, 4)}\`);

// Using the power function
console.log(\`2² = \${power(2)}\`);
console.log(\`2³ = \${power(2, 3)}\`);

// Using the sumAll function
console.log(\`Sum of 1,2,3,4,5 = \${sumAll(1, 2, 3, 4, 5)}\`);

// Using the higher-order function
const multiplyResult = applyOperation(4, 5, (a, b) => a * b);
console.log(\`4 × 5 = \${multiplyResult}\`);

// Function with object parameter destructuring (ES6)
function printUserInfo({ name, age, email = 'Not provided' }) {
  console.log(\`User: \${name}, Age: \${age}, Email: \${email}\`);
}

// Call function with object
printUserInfo({
  name: "John Doe",
  age: 30,
  email: "john@example.com"
});`
        },
        'oops': {
            python: `# Example of Object-Oriented Programming in Python

class Vehicle:
    """Base class for all vehicles"""
    
    # Class variable shared by all instances
    vehicle_count = 0
    
    def __init__(self, make, model, year):
        """Initialize a new Vehicle
        
        Args:
            make (str): Manufacturer of the vehicle
            model (str): Model name
            year (int): Year manufactured
        """
        self.make = make
        self.model = model
        self.year = year
        self.is_running = False
        Vehicle.vehicle_count += 1
    
    def start_engine(self):
        """Start the vehicle's engine"""
        if not self.is_running:
            self.is_running = True
            return f"{self.make} {self.model}'s engine started"
        return f"{self.make} {self.model}'s engine is already running"
    
    def stop_engine(self):
        """Stop the vehicle's engine"""
        if self.is_running:
            self.is_running = False
            return f"{self.make} {self.model}'s engine stopped"
        return f"{self.make} {self.model}'s engine is already off"
    
    def info(self):
        """Return information about the vehicle"""
        return f"{self.year} {self.make} {self.model}"
    
    @property
    def age(self):
        """Calculate the age of the vehicle"""
        from datetime import datetime
        current_year = datetime.now().year
        return current_year - self.year
    
    @classmethod
    def get_total_count(cls):
        """Get total number of vehicles created"""
        return cls.vehicle_count
    
    @staticmethod
    def validate_year(year):
        """Validate if year is reasonable for a vehicle
        
        Args:
            year (int): Year to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        from datetime import datetime
        current_year = datetime.now().year
        return 1886 <= year <= current_year + 1


class Car(Vehicle):
    """Car class that extends Vehicle"""
    
    def __init__(self, make, model, year, num_doors):
        """Initialize a new Car
        
        Args:
            make (str): Manufacturer of the car
            model (str): Model name
            year (int): Year manufactured
            num_doors (int): Number of doors
        """
        # Call parent class's __init__ method
        super().__init__(make, model, year)
        
        # Car-specific attributes
        self.num_doors = num_doors
        self.trunk_open = False
    
    def open_trunk(self):
        """Open the car's trunk"""
        if not self.trunk_open:
            self.trunk_open = True
            return f"{self.make} {self.model}'s trunk opened"
        return f"{self.make} {self.model}'s trunk is already open"
    
    def close_trunk(self):
        """Close the car's trunk"""
        if self.trunk_open:
            self.trunk_open = False
            return f"{self.make} {self.model}'s trunk closed"
        return f"{self.make} {self.model}'s trunk is already closed"
    
    def info(self):
        """Override info method to include number of doors"""
        return f"{super().info()}, {self.num_doors} doors"


class Motorcycle(Vehicle):
    """Motorcycle class that extends Vehicle"""
    
    def __init__(self, make, model, year, has_sidecar):
        """Initialize a new Motorcycle
        
        Args:
            make (str): Manufacturer of the motorcycle
            model (str): Model name
            year (int): Year manufactured
            has_sidecar (bool): Whether the motorcycle has a sidecar
        """
        super().__init__(make, model, year)
        self.has_sidecar = has_sidecar
    
    def wheelie(self):
        """Perform a wheelie if conditions are right"""
        if self.has_sidecar:
            return f"Cannot perform wheelie on {self.make} {self.model} with a sidecar"
        if self.is_running:
            return f"Performing a wheelie on the {self.make} {self.model}!"
        return f"Cannot perform wheelie - engine is not running"
    
    def info(self):
        """Override info method to mention sidecar if present"""
        base_info = super().info()
        if self.has_sidecar:
            return f"{base_info} with sidecar"
        return base_info


# Testing our classes
print(f"Is 2023 a valid vehicle year? {Vehicle.validate_year(2023)}")
print(f"Is 1800 a valid vehicle year? {Vehicle.validate_year(1800)}")

# Create a car
my_car = Car("Toyota", "Camry", 2020, 4)
print(my_car.info())
print(my_car.start_engine())
print(my_car.open_trunk())
print(f"Car age: {my_car.age} years")
print(my_car.stop_engine())

# Create a motorcycle
my_bike = Motorcycle("Harley-Davidson", "Sportster", 2019, False)
print(my_bike.info())
print(my_bike.start_engine())
print(my_bike.wheelie())
print(f"Motorcycle age: {my_bike.age} years")

# Using the class variable and class method
another_car = Car("Honda", "Civic", 2021, 4)
print(f"Total vehicles created: {Vehicle.get_total_count()}")`,

            javascript: `// Example of Object-Oriented Programming in JavaScript

// Base Vehicle class
class Vehicle {
  // Static class property
  static vehicleCount = 0;
  
  /**
   * Create a new Vehicle
   * @param {string} make - Manufacturer of the vehicle
   * @param {string} model - Model name
   * @param {number} year - Year manufactured
   */
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.isRunning = false;
    Vehicle.vehicleCount++;
  }
  
  /**
   * Start the vehicle's engine
   * @returns {string} Status message
   */
  startEngine() {
    if (!this.isRunning) {
      this.isRunning = true;
      return \`\${this.make} \${this.model}'s engine started\`;
    }
    return \`\${this.make} \${this.model}'s engine is already running\`;
  }
  
  /**
   * Stop the vehicle's engine
   * @returns {string} Status message
   */
  stopEngine() {
    if (this.isRunning) {
      this.isRunning = false;
      return \`\${this.make} \${this.model}'s engine stopped\`;
    }
    return \`\${this.make} \${this.model}'s engine is already off\`;
  }
  
  /**
   * Get information about the vehicle
   * @returns {string} Vehicle information
   */
  info() {
    return \`\${this.year} \${this.make} \${this.model}\`;
  }
  
  /**
   * Calculate the age of the vehicle
   * @returns {number} Age in years
   */
  get age() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.year;
  }
  
  /**
   * Get total number of vehicles created
   * @returns {number} Total vehicle count
   */
  static getTotalCount() {
    return Vehicle.vehicleCount;
  }
  
  /**
   * Validate if year is reasonable for a vehicle
   * @param {number} year - Year to validate
   * @returns {boolean} True if valid, False otherwise
   */
  static validateYear(year) {
    const currentYear = new Date().getFullYear();
    return 1886 <= year && year <= currentYear + 1;
  }
}

// Car class that extends Vehicle
class Car extends Vehicle {
  /**
   * Create a new Car
   * @param {string} make - Manufacturer of the car
   * @param {string} model - Model name
   * @param {number} year - Year manufactured
   * @param {number} numDoors - Number of doors
   */
  constructor(make, model, year, numDoors) {
    // Call parent class's constructor
    super(make, model, year);
    
    // Car-specific properties
    this.numDoors = numDoors;
    this.trunkOpen = false;
  }
  
  /**
   * Open the car's trunk
   * @returns {string} Status message
   */
  openTrunk() {
    if (!this.trunkOpen) {
      this.trunkOpen = true;
      return \`\${this.make} \${this.model}'s trunk opened\`;
    }
    return \`\${this.make} \${this.model}'s trunk is already open\`;
  }
  
  /**
   * Close the car's trunk
   * @returns {string} Status message
   */
  closeTrunk() {
    if (this.trunkOpen) {
      this.trunkOpen = false;
      return \`\${this.make} \${this.model}'s trunk closed\`;
    }
    return \`\${this.make} \${this.model}'s trunk is already closed\`;
  }
  
  /**
   * Override info method to include number of doors
   * @returns {string} Car information
   */
  info() {
    return \`\${super.info()}, \${this.numDoors} doors\`;
  }
}

// Motorcycle class that extends Vehicle
class Motorcycle extends Vehicle {
  /**
   * Create a new Motorcycle
   * @param {string} make - Manufacturer of the motorcycle
   * @param {string} model - Model name
   * @param {number} year - Year manufactured
   * @param {boolean} hasSidecar - Whether it has a sidecar
   */
  constructor(make, model, year, hasSidecar) {
    super(make, model, year);
    this.hasSidecar = hasSidecar;
  }
  
  /**
   * Perform a wheelie if conditions are right
   * @returns {string} Status message
   */
  wheelie() {
    if (this.hasSidecar) {
      return \`Cannot perform wheelie on \${this.make} \${this.model} with a sidecar\`;
    }
    if (this.isRunning) {
      return \`Performing a wheelie on the \${this.make} \${this.model}!\`;
    }
    return \`Cannot perform wheelie - engine is not running\`;
  }
  
  /**
   * Override info method to mention sidecar if present
   * @returns {string} Motorcycle information
   */
  info() {
    const baseInfo = super.info();
    if (this.hasSidecar) {
      return \`\${baseInfo} with sidecar\`;
    }
    return baseInfo;
  }
}

// Testing our classes
console.log(\`Is 2023 a valid vehicle year? \${Vehicle.validateYear(2023)}\`);
console.log(\`Is 1800 a valid vehicle year? \${Vehicle.validateYear(1800)}\`);

// Create a car
const myCar = new Car("Toyota", "Camry", 2020, 4);
console.log(myCar.info());
console.log(myCar.startEngine());
console.log(myCar.openTrunk());
console.log(\`Car age: \${myCar.age} years\`);
console.log(myCar.stopEngine());

// Create a motorcycle
const myBike = new Motorcycle("Harley-Davidson", "Sportster", 2019, false);
console.log(myBike.info());
console.log(myBike.startEngine());
console.log(myBike.wheelie());
console.log(\`Motorcycle age: \${myBike.age} years\`);

// Using the static property and method
const anotherCar = new Car("Honda", "Civic", 2021, 4);
console.log(\`Total vehicles created: \${Vehicle.getTotalCount()}\`);`
        },
        'recursion': {
            python: `# Examples of recursion in Python

def factorial(n):
    """Calculate factorial using recursion
    
    Args:
        n (int): A non-negative integer
        
    Returns:
        int: The factorial of n (n!)
    """
    # Base case: 0! or 1! = 1
    if n <= 1:
        return 1
    
    # Recursive case: n! = n * (n-1)!
    return n * factorial(n - 1)

def fibonacci(n):
    """Calculate the nth Fibonacci number using recursion
    
    Args:
        n (int): A non-negative integer
        
    Returns:
        int: The nth Fibonacci number
    """
    # Base cases: F(0) = 0, F(1) = 1
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    # Recursive case: F(n) = F(n-1) + F(n-2)
    return fibonacci(n - 1) + fibonacci(n - 2)

def sum_digits(n):
    """Sum the digits of a number using recursion
    
    Args:
        n (int): A non-negative integer
        
    Returns:
        int: The sum of the digits in n
    """
    # Base case: single digit
    if n < 10:
        return n
    
    # Recursive case: add last digit + sum of remaining digits
    return n % 10 + sum_digits(n // 10)

def power(base, exponent):
    """Calculate power using recursion
    
    Args:
        base (int): The base number
        exponent (int): A non-negative integer exponent
        
    Returns:
        int: base raised to the power of exponent
    """
    # Base case: anything raised to 0 is 1
    if exponent == 0:
        return 1
    
    # Recursive case: base^exp = base * base^(exp-1)
    return base * power(base, exponent - 1)

def reverse_string(s):
    """Reverse a string using recursion
    
    Args:
        s (str): The string to reverse
        
    Returns:
        str: The reversed string
    """
    # Base case: empty string or single character
    if len(s) <= 1:
        return s
    
    # Recursive case: first char goes to the end
    return reverse_string(s[1:]) + s[0]

def is_palindrome(s):
    """Check if a string is a palindrome using recursion
    
    Args:
        s (str): The string to check
        
    Returns:
        bool: True if s is a palindrome, False otherwise
    """
    # Base case: empty string or single character
    if len(s) <= 1:
        return True
    
    # Check if first and last characters match
    if s[0] != s[-1]:
        return False
    
    # Recursive case: check the rest of the string
    return is_palindrome(s[1:-1])

# Testing the recursive functions
print(f"Factorial of 5: {factorial(5)}")
print(f"Fibonacci number 7: {fibonacci(7)}")
print(f"Sum of digits in 12345: {sum_digits(12345)}")
print(f"2 raised to power 8: {power(2, 8)}")
print(f"Reverse of 'hello': {reverse_string('hello')}")
print(f"Is 'racecar' a palindrome? {is_palindrome('racecar')}")
print(f"Is 'hello' a palindrome? {is_palindrome('hello')}")`
        },
        'data-structures': {
            python: `# Examples of common data structures in Python

# Lists (Dynamic Arrays)
print("=== Lists ===")
fruits = ["apple", "banana", "cherry", "date"]
print(f"Original list: {fruits}")

# List operations
fruits.append("elderberry")  # Add to end
print(f"After append: {fruits}")

fruits.insert(1, "blueberry")  # Insert at position
print(f"After insert: {fruits}")

removed_fruit = fruits.pop(2)  # Remove and return item at index
print(f"Removed: {removed_fruit}")
print(f"After pop: {fruits}")

fruits.remove("date")  # Remove by value
print(f"After remove: {fruits}")

# List slicing
print(f"First two fruits: {fruits[:2]}")
print(f"Last two fruits: {fruits[-2:]}")

# List comprehension
squared = [x**2 for x in range(1, 6)]
print(f"Squares from 1-5: {squared}")

# Dictionaries (Hash Maps)
print("\\n=== Dictionaries ===")
person = {
    "name": "John Doe",
    "age": 30,
    "occupation": "Software Engineer",
    "skills": ["Python", "JavaScript", "SQL"]
}
print(f"Person dictionary: {person}")

# Dictionary operations
person["location"] = "New York"  # Add new key-value pair
print(f"After adding location: {person}")

person["age"] = 31  # Update existing value
print(f"After updating age: {person}")

removed_occupation = person.pop("occupation")  # Remove and return value
print(f"Removed occupation: {removed_occupation}")
print(f"After pop: {person}")

# Dictionary methods
print(f"Keys: {list(person.keys())}")
print(f"Values: {list(person.values())}")
print(f"Items: {list(person.items())}")

# Dictionary comprehension
squared_dict = {x: x**2 for x in range(1, 6)}
print(f"Squares dict: {squared_dict}")

# Sets (Unique Collections)
print("\\n=== Sets ===")
fruits_set = {"apple", "banana", "cherry", "apple"}  # Note: duplicates are removed
print(f"Fruits set: {fruits_set}")

# Set operations
fruits_set.add("date")
print(f"After add: {fruits_set}")

fruits_set.remove("banana")
print(f"After remove: {fruits_set}")

# Set operations
set_a = {1, 2, 3, 4, 5}
set_b = {4, 5, 6, 7, 8}
print(f"Set A: {set_a}")
print(f"Set B: {set_b}")
print(f"Union: {set_a | set_b}")
print(f"Intersection: {set_a & set_b}")
print(f"Difference (A-B): {set_a - set_b}")
print(f"Symmetric difference: {set_a ^ set_b}")

# Tuples (Immutable Sequences)
print("\\n=== Tuples ===")
point = (10, 20)  # Immutable, fixed size
print(f"Point: {point}")
print(f"X coordinate: {point[0]}")
print(f"Y coordinate: {point[1]}")

# Tuple packing and unpacking
coordinates = 10, 20, 30  # Packing
print(f"3D coordinates: {coordinates}")

x, y, z = coordinates  # Unpacking
print(f"Unpacked - x: {x}, y: {y}, z: {z}")

# Custom data structure: Stack
print("\\n=== Stack Implementation ===")
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)
    
    def __str__(self):
        return str(self.items)

# Using the Stack
stack = Stack()
print(f"Empty stack: {stack}")
print(f"Is empty? {stack.is_empty()}")

stack.push("first")
stack.push("second")
stack.push("third")
print(f"After pushes: {stack}")
print(f"Size: {stack.size()}")
print(f"Top element: {stack.peek()}")

popped = stack.pop()
print(f"Popped: {popped}")
print(f"After pop: {stack}")

# Custom data structure: Queue
print("\\n=== Queue Implementation ===")
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()
        return None
    
    def peek(self):
        if not self.is_empty():
            return self.items[0]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)
    
    def __str__(self):
        return str(list(self.items))

# Using the Queue
queue = Queue()
print(f"Empty queue: {queue}")
print(f"Is empty? {queue.is_empty()}")

queue.enqueue("first")
queue.enqueue("second")
queue.enqueue("third")
print(f"After enqueues: {queue}")
print(f"Size: {queue.size()}")
print(f"Front element: {queue.peek()}")

dequeued = queue.dequeue()
print(f"Dequeued: {dequeued}")
print(f"After dequeue: {queue}")`
        }
    };
    
    return examples[concept]?.[language] || "// Example code for this concept and language combination is not available.";
}