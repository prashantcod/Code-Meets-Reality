// This file contains example code and real-world applications for different concepts

// Function to get example data based on concept and language
function getExampleData(concept, language = 'python') {
    // Default to Python if language not found
    if (!exampleData[concept] || !exampleData[concept][language]) {
        language = 'python';
    }
    
    return exampleData[concept][language];
}

// Function to update real-world example in the UI
function updateRealWorldExample(realWorldData) {
    const realWorldContent = document.getElementById('real-world-content');
    
    realWorldContent.innerHTML = `
        <div class="real-world-example">
            <div class="example-header">
                <h3>${realWorldData.title}</h3>
                <p>${realWorldData.subtitle}</p>
            </div>
            <div class="example-description">
                ${realWorldData.description}
            </div>
            <div class="example-visualization">
                ${realWorldData.visualization || ''}
            </div>
        </div>
    `;
}

// Example data for different concepts and languages
const exampleData = {
    'if-else': {
        'python': {
            code: `# Login validation example
username = "user123"  # Try changing this
password = "pass123"  # Try changing this

# Check if login credentials are valid
if username == "user123" and password == "pass123":
    print("Login successful! Welcome back.")
    access_level = "admin"
elif username == "user123":
    print("Incorrect password. Please try again.")
    access_level = "none"
else:
    print("User not found. Please register.")
    access_level = "none"

# Check access level and show appropriate message
if access_level == "admin":
    print("You have full access to the system.")
else:
    print("You don't have access to the system.")`,
            
            realWorld: {
                title: "User Authentication System",
                subtitle: "How if-else statements power login systems",
                description: `
                <p>When you log into any application, if-else statements are working behind the scenes to validate your credentials and determine your access level.</p>
                
                <p>In this example, the code checks:</p>
                <ol>
                    <li>If both username and password match → Login successful</li>
                    <li>If only username matches → Password error</li>
                    <li>If username doesn't match → User not found</li>
                </ol>
                
                <p>Then it uses another if-else statement to check access privileges based on the authentication result.</p>
                
                <p>This is the same pattern used in applications like:</p>
                <ul>
                    <li>Social media platforms (Facebook, Twitter)</li>
                    <li>Email services (Gmail, Outlook)</li>
                    <li>Banking applications</li>
                    <li>E-commerce websites (Amazon, eBay)</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="150" height="60" rx="5" fill="#f1c40f" />
                    <text x="85" y="45" text-anchor="middle" font-size="14">Login Attempt</text>
                    
                    <line x1="85" y1="70" x2="85" y2="90" stroke="#34495e" stroke-width="2" />
                    <polygon points="85,95 80,85 90,85" fill="#34495e" />
                    
                    <rect x="10" y="100" width="150" height="60" rx="5" fill="#3498db" />
                    <text x="85" y="130" text-anchor="middle" font-size="12">Username = user123</text>
                    <text x="85" y="145" text-anchor="middle" font-size="12">Password = pass123?</text>
                    
                    <line x1="160" y1="130" x2="200" y2="130" stroke="#34495e" stroke-width="2" />
                    <text x="180" y="120" text-anchor="middle" font-size="12">Yes</text>
                    <polygon points="205,130 195,125 195,135" fill="#34495e" />
                    
                    <rect x="210" y="100" width="120" height="60" rx="5" fill="#2ecc71" />
                    <text x="270" y="135" text-anchor="middle" font-size="12">Login Success</text>
                    
                    <line x1="85" y1="160" x2="85" y2="180" stroke="#34495e" stroke-width="2" />
                    <text x="100" y="170" text-anchor="middle" font-size="12">No</text>
                    <polygon points="85,185 80,175 90,175" fill="#34495e" />
                    
                    <rect x="25" y="190" width="120" height="60" rx="5" fill="#e74c3c" />
                    <text x="85" y="225" text-anchor="middle" font-size="12">Login Failed</text>
                </svg>
                `
            }
        },
        'javascript': {
            code: `// Login validation example
const username = "user123";  // Try changing this
const password = "pass123";  // Try changing this

// Check if login credentials are valid
let accessLevel = "none";

if (username === "user123" && password === "pass123") {
    console.log("Login successful! Welcome back.");
    accessLevel = "admin";
} else if (username === "user123") {
    console.log("Incorrect password. Please try again.");
} else {
    console.log("User not found. Please register.");
}

// Check access level and show appropriate message
if (accessLevel === "admin") {
    console.log("You have full access to the system.");
} else {
    console.log("You don't have access to the system.");
}`,
            realWorld: {
                title: "User Authentication System",
                subtitle: "How if-else statements power login systems in JavaScript",
                description: `
                <p>From simple websites to complex web applications, JavaScript if-else statements control user authentication flows.</p>
                
                <p>In this example, the code checks:</p>
                <ol>
                    <li>If both username and password match → Login successful</li>
                    <li>If only username matches → Password error</li>
                    <li>If username doesn't match → User not found</li>
                </ol>
                
                <p>Then it uses another if-else statement to check access privileges based on the authentication result.</p>
                
                <p>This pattern is commonly used in:</p>
                <ul>
                    <li>Web applications like Gmail or Slack</li>
                    <li>Single-page applications (SPAs)</li>
                    <li>Mobile web interfaces</li>
                    <li>Progressive Web Apps (PWAs)</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="150" height="60" rx="5" fill="#f1c40f" />
                    <text x="85" y="45" text-anchor="middle" font-size="14">Login Attempt</text>
                    
                    <line x1="85" y1="70" x2="85" y2="90" stroke="#34495e" stroke-width="2" />
                    <polygon points="85,95 80,85 90,85" fill="#34495e" />
                    
                    <rect x="10" y="100" width="150" height="60" rx="5" fill="#3498db" />
                    <text x="85" y="130" text-anchor="middle" font-size="12">username === "user123"</text>
                    <text x="85" y="145" text-anchor="middle" font-size="12">password === "pass123"?</text>
                    
                    <line x1="160" y1="130" x2="200" y2="130" stroke="#34495e" stroke-width="2" />
                    <text x="180" y="120" text-anchor="middle" font-size="12">Yes</text>
                    <polygon points="205,130 195,125 195,135" fill="#34495e" />
                    
                    <rect x="210" y="100" width="120" height="60" rx="5" fill="#2ecc71" />
                    <text x="270" y="135" text-anchor="middle" font-size="12">Login Success</text>
                    
                    <line x1="85" y1="160" x2="85" y2="180" stroke="#34495e" stroke-width="2" />
                    <text x="100" y="170" text-anchor="middle" font-size="12">No</text>
                    <polygon points="85,185 80,175 90,175" fill="#34495e" />
                    
                    <rect x="25" y="190" width="120" height="60" rx="5" fill="#e74c3c" />
                    <text x="85" y="225" text-anchor="middle" font-size="12">Login Failed</text>
                </svg>
                `
            }
        },
        'java': {
            code: `// Login validation example
public class LoginSystem {
    public static void main(String[] args) {
        String username = "user123";  // Try changing this
        String password = "pass123";  // Try changing this
        
        String accessLevel = "none";
        
        // Check if login credentials are valid
        if (username.equals("user123") && password.equals("pass123")) {
            System.out.println("Login successful! Welcome back.");
            accessLevel = "admin";
        } else if (username.equals("user123")) {
            System.out.println("Incorrect password. Please try again.");
        } else {
            System.out.println("User not found. Please register.");
        }
        
        // Check access level and show appropriate message
        if (accessLevel.equals("admin")) {
            System.out.println("You have full access to the system.");
        } else {
            System.out.println("You don't have access to the system.");
        }
    }
}`,
            realWorld: {
                title: "Enterprise Authentication System",
                subtitle: "How if-else statements power login systems in Java applications",
                description: `
                <p>Java powers many enterprise applications where secure authentication is critical.</p>
                
                <p>In this example, the code checks:</p>
                <ol>
                    <li>If both username and password match → Login successful</li>
                    <li>If only username matches → Password error</li>
                    <li>If username doesn't match → User not found</li>
                </ol>
                
                <p>Then it uses another if-else statement to check access privileges based on the authentication result.</p>
                
                <p>This pattern is commonly used in:</p>
                <ul>
                    <li>Banking applications</li>
                    <li>Enterprise Resource Planning (ERP) systems</li>
                    <li>Customer Relationship Management (CRM) tools</li>
                    <li>Healthcare information systems</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="150" height="60" rx="5" fill="#f1c40f" />
                    <text x="85" y="45" text-anchor="middle" font-size="14">Login Attempt</text>
                    
                    <line x1="85" y1="70" x2="85" y2="90" stroke="#34495e" stroke-width="2" />
                    <polygon points="85,95 80,85 90,85" fill="#34495e" />
                    
                    <rect x="10" y="100" width="150" height="60" rx="5" fill="#3498db" />
                    <text x="85" y="130" text-anchor="middle" font-size="12">username.equals("user123")</text>
                    <text x="85" y="145" text-anchor="middle" font-size="11">password.equals("pass123")?</text>
                    
                    <line x1="160" y1="130" x2="200" y2="130" stroke="#34495e" stroke-width="2" />
                    <text x="180" y="120" text-anchor="middle" font-size="12">Yes</text>
                    <polygon points="205,130 195,125 195,135" fill="#34495e" />
                    
                    <rect x="210" y="100" width="120" height="60" rx="5" fill="#2ecc71" />
                    <text x="270" y="135" text-anchor="middle" font-size="12">Login Success</text>
                    
                    <line x1="85" y1="160" x2="85" y2="180" stroke="#34495e" stroke-width="2" />
                    <text x="100" y="170" text-anchor="middle" font-size="12">No</text>
                    <polygon points="85,185 80,175 90,175" fill="#34495e" />
                    
                    <rect x="25" y="190" width="120" height="60" rx="5" fill="#e74c3c" />
                    <text x="85" y="225" text-anchor="middle" font-size="12">Login Failed</text>
                </svg>
                `
            }
        }
    },
    'oops': {
        'python': {
            code: `# Inheritance Example: Vehicle Hierarchy
class Vehicle:
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year
        self.is_running = False
    
    def start_engine(self):
        self.is_running = True
        return f"{self.make} {self.model}'s engine started."
    
    def stop_engine(self):
        self.is_running = False
        return f"{self.make} {self.model}'s engine stopped."
    
    def info(self):
        return f"{self.year} {self.make} {self.model}"

# Car class inherits from Vehicle
class Car(Vehicle):
    def __init__(self, make, model, year, num_doors):
        # Call parent class constructor
        super().__init__(make, model, year)
        self.num_doors = num_doors
        self.type = "Car"
    
    def drive(self):
        if self.is_running:
            return f"{self.info()} is driving on the road."
        else:
            return f"You need to start the engine first!"

# Create objects and test
my_car = Car("Toyota", "Corolla", 2020, 4)
print(my_car.info())
print(my_car.start_engine())
print(my_car.drive())
print(my_car.stop_engine())`,
            realWorld: {
                title: "Vehicle Management System",
                subtitle: "How OOP and inheritance are used in real-world applications",
                description: `
                <p>Object-Oriented Programming (OOP) principles like inheritance are the foundation of modern software development. They help organize code in a way that mirrors real-world relationships.</p>
                
                <p>In this example:</p>
                <ul>
                    <li><strong>Base Class (Vehicle)</strong>: Contains common properties and methods shared by all vehicles</li>
                    <li><strong>Derived Class (Car)</strong>: Inherits from Vehicle, adding specific car-related features</li>
                </ul>
                
                <p>This pattern is used in real-world applications like:</p>
                <ul>
                    <li><strong>Car Dealership Systems</strong>: Managing different vehicle types and their properties</li>
                    <li><strong>Traffic Simulation Software</strong>: Modeling different vehicle behaviors</li>
                    <li><strong>Ride-Sharing Apps</strong>: Handling different vehicle categories (economy, premium, etc.)</li>
                    <li><strong>Vehicle Manufacturing Systems</strong>: Tracking production across vehicle models</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="300" xmlns="http://www.w3.org/2000/svg">
                    <!-- Vehicle Base Class -->
                    <rect x="150" y="10" width="200" height="110" rx="5" fill="#3498db" />
                    <line x1="150" y1="40" x2="350" y2="40" stroke="white" stroke-width="1" />
                    <text x="250" y="30" text-anchor="middle" font-size="16" fill="white">Vehicle</text>
                    <text x="160" y="60" font-size="12" fill="white">+ make, model, year</text>
                    <text x="160" y="80" font-size="12" fill="white">+ is_running</text>
                    <line x1="150" y1="90" x2="350" y2="90" stroke="white" stroke-width="1" />
                    <text x="160" y="110" font-size="12" fill="white">+ start_engine(), stop_engine()</text>
                    
                    <!-- Inheritance Arrow -->
                    <line x1="250" y1="120" x2="250" y2="170" stroke="#34495e" stroke-width="2" />
                    <polygon points="250,175 245,165 255,165" fill="#34495e" />
                    
                    <!-- Car Class -->
                    <rect x="150" y="180" width="200" height="110" rx="5" fill="#2ecc71" />
                    <line x1="150" y1="210" x2="350" y2="210" stroke="white" stroke-width="1" />
                    <text x="250" y="200" text-anchor="middle" font-size="16" fill="white">Car</text>
                    <text x="160" y="230" font-size="12" fill="white">+ num_doors</text>
                    <text x="160" y="250" font-size="12" fill="white">+ type = "Car"</text>
                    <line x1="150" y1="260" x2="350" y2="260" stroke="white" stroke-width="1" />
                    <text x="160" y="280" font-size="12" fill="white">+ drive()</text>
                    
                    <!-- Instance -->
                    <rect x="400" y="180" width="150" height="110" rx="5" fill="#f1c40f" />
                    <text x="475" y="200" text-anchor="middle" font-size="14" fill="#333">my_car</text>
                    <line x1="400" y1="210" x2="550" y2="210" stroke="#333" stroke-width="1" />
                    <text x="410" y="230" font-size="12" fill="#333">make: "Toyota"</text>
                    <text x="410" y="250" font-size="12" fill="#333">model: "Corolla"</text>
                    <text x="410" y="270" font-size="12" fill="#333">year: 2020</text>
                    <text x="410" y="290" font-size="12" fill="#333">num_doors: 4</text>
                    
                    <!-- Instance Creation -->
                    <line x1="350" y1="230" x2="400" y2="230" stroke="#34495e" stroke-width="2" stroke-dasharray="5,3" />
                    <text x="375" y="220" text-anchor="middle" font-size="12" fill="#34495e">creates</text>
                </svg>
                `
            }
        },
        'javascript': {
            code: `// Inheritance Example: Vehicle Hierarchy
class Vehicle {
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.isRunning = false;
    }
    
    startEngine() {
        this.isRunning = true;
        return `${this.make} ${this.model}'s engine started.`;
    }
    
    stopEngine() {
        this.isRunning = false;
        return `${this.make} ${this.model}'s engine stopped.`;
    }
    
    info() {
        return `${this.year} ${this.make} ${this.model}`;
    }
}

// Car class inherits from Vehicle
class Car extends Vehicle {
    constructor(make, model, year, numDoors) {
        // Call parent class constructor
        super(make, model, year);
        this.numDoors = numDoors;
        this.type = "Car";
    }
    
    drive() {
        if (this.isRunning) {
            return `${this.info()} is driving on the road.`;
        } else {
            return "You need to start the engine first!";
        }
    }
}

// Create objects and test
const myCar = new Car("Toyota", "Corolla", 2020, 4);
console.log(myCar.info());
console.log(myCar.startEngine());
console.log(myCar.drive());
console.log(myCar.stopEngine());`,
            realWorld: {
                title: "Interactive Car Configurator",
                subtitle: "How OOP and inheritance power web-based vehicle customization",
                description: `
                <p>When you use a car buying website to configure your dream car, JavaScript OOP is likely powering the system behind the scenes.</p>
                
                <p>In this example:</p>
                <ul>
                    <li><strong>Base Class (Vehicle)</strong>: Contains common properties shared by all vehicles</li>
                    <li><strong>Derived Class (Car)</strong>: Adds car-specific features and behaviors</li>
                </ul>
                
                <p>This pattern is used in real-world applications like:</p>
                <ul>
                    <li><strong>Car Manufacturer Websites</strong>: Letting customers build and customize vehicles</li>
                    <li><strong>Vehicle Rental Platforms</strong>: Managing different vehicle types and availability</li>
                    <li><strong>Automotive E-commerce Sites</strong>: Displaying vehicles with different specifications</li>
                    <li><strong>Racing Games</strong>: Implementing different vehicle types with shared behaviors</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="300" xmlns="http://www.w3.org/2000/svg">
                    <!-- Vehicle Base Class -->
                    <rect x="150" y="10" width="200" height="110" rx="5" fill="#3498db" />
                    <line x1="150" y1="40" x2="350" y2="40" stroke="white" stroke-width="1" />
                    <text x="250" y="30" text-anchor="middle" font-size="16" fill="white">Vehicle</text>
                    <text x="160" y="60" font-size="12" fill="white">+ make, model, year</text>
                    <text x="160" y="80" font-size="12" fill="white">+ isRunning</text>
                    <line x1="150" y1="90" x2="350" y2="90" stroke="white" stroke-width="1" />
                    <text x="160" y="110" font-size="12" fill="white">+ startEngine(), stopEngine()</text>
                    
                    <!-- Inheritance Arrow -->
                    <line x1="250" y1="120" x2="250" y2="170" stroke="#34495e" stroke-width="2" />
                    <polygon points="250,175 245,165 255,165" fill="#34495e" />
                    
                    <!-- Car Class -->
                    <rect x="150" y="180" width="200" height="110" rx="5" fill="#2ecc71" />
                    <line x1="150" y1="210" x2="350" y2="210" stroke="white" stroke-width="1" />
                    <text x="250" y="200" text-anchor="middle" font-size="16" fill="white">Car</text>
                    <text x="160" y="230" font-size="12" fill="white">+ numDoors</text>
                    <text x="160" y="250" font-size="12" fill="white">+ type = "Car"</text>
                    <line x1="150" y1="260" x2="350" y2="260" stroke="white" stroke-width="1" />
                    <text x="160" y="280" font-size="12" fill="white">+ drive()</text>
                    
                    <!-- Instance -->
                    <rect x="400" y="180" width="150" height="110" rx="5" fill="#f1c40f" />
                    <text x="475" y="200" text-anchor="middle" font-size="14" fill="#333">myCar</text>
                    <line x1="400" y1="210" x2="550" y2="210" stroke="#333" stroke-width="1" />
                    <text x="410" y="230" font-size="12" fill="#333">make: "Toyota"</text>
                    <text x="410" y="250" font-size="12" fill="#333">model: "Corolla"</text>
                    <text x="410" y="270" font-size="12" fill="#333">year: 2020</text>
                    <text x="410" y="290" font-size="12" fill="#333">numDoors: 4</text>
                    
                    <!-- Instance Creation -->
                    <line x1="350" y1="230" x2="400" y2="230" stroke="#34495e" stroke-width="2" stroke-dasharray="5,3" />
                    <text x="375" y="220" text-anchor="middle" font-size="12" fill="#34495e">creates</text>
                </svg>
                `
            }
        },
        'java': {
            code: `// Inheritance Example: Vehicle Hierarchy
class Vehicle {
    private String make;
    private String model;
    private int year;
    private boolean isRunning;
    
    public Vehicle(String make, String model, int year) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.isRunning = false;
    }
    
    public String startEngine() {
        this.isRunning = true;
        return make + " " + model + "'s engine started.";
    }
    
    public String stopEngine() {
        this.isRunning = false;
        return make + " " + model + "'s engine stopped.";
    }
    
    public String info() {
        return year + " " + make + " " + model;
    }
    
    public boolean isRunning() {
        return isRunning;
    }
}

// Car class inherits from Vehicle
class Car extends Vehicle {
    private int numDoors;
    private String type;
    
    public Car(String make, String model, int year, int numDoors) {
        // Call parent class constructor
        super(make, model, year);
        this.numDoors = numDoors;
        this.type = "Car";
    }
    
    public String drive() {
        if (isRunning()) {
            return info() + " is driving on the road.";
        } else {
            return "You need to start the engine first!";
        }
    }
}

// Main class to test
public class VehicleTest {
    public static void main(String[] args) {
        Car myCar = new Car("Toyota", "Corolla", 2020, 4);
        System.out.println(myCar.info());
        System.out.println(myCar.startEngine());
        System.out.println(myCar.drive());
        System.out.println(myCar.stopEngine());
    }
}`,
            realWorld: {
                title: "Enterprise Fleet Management System",
                subtitle: "How Java OOP powers vehicle fleet management software",
                description: `
                <p>Java's strong OOP capabilities make it ideal for enterprise applications like fleet management systems used by logistics companies, rental agencies, and delivery services.</p>
                
                <p>In this example:</p>
                <ul>
                    <li><strong>Base Class (Vehicle)</strong>: Defines common attributes and behaviors</li>
                    <li><strong>Derived Class (Car)</strong>: Extends the base with car-specific features</li>
                    <li><strong>Encapsulation</strong>: Private fields with appropriate access methods</li>
                </ul>
                
                <p>This pattern is used in real-world applications like:</p>
                <ul>
                    <li><strong>Fleet Tracking Systems</strong>: Monitoring various vehicle types in real-time</li>
                    <li><strong>Logistics Management</strong>: Optimizing delivery routes based on vehicle capabilities</li>
                    <li><strong>Maintenance Management</strong>: Scheduling service based on vehicle type and usage</li>
                    <li><strong>Asset Management</strong>: Tracking depreciation and value of vehicle assets</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="320" xmlns="http://www.w3.org/2000/svg">
                    <!-- Vehicle Base Class -->
                    <rect x="150" y="10" width="200" height="120" rx="5" fill="#3498db" />
                    <line x1="150" y1="40" x2="350" y2="40" stroke="white" stroke-width="1" />
                    <text x="250" y="30" text-anchor="middle" font-size="16" fill="white">Vehicle</text>
                    <text x="160" y="60" font-size="12" fill="white">- make, model, year</text>
                    <text x="160" y="80" font-size="12" fill="white">- isRunning</text>
                    <line x1="150" y1="90" x2="350" y2="90" stroke="white" stroke-width="1" />
                    <text x="160" y="110" font-size="12" fill="white">+ startEngine(), stopEngine()</text>
                    <text x="160" y="130" font-size="12" fill="white">+ info(), isRunning()</text>
                    
                    <!-- Inheritance Arrow -->
                    <line x1="250" y1="130" x2="250" y2="170" stroke="#34495e" stroke-width="2" />
                    <polygon points="250,175 245,165 255,165" fill="#34495e" />
                    
                    <!-- Car Class -->
                    <rect x="150" y="180" width="200" height="110" rx="5" fill="#2ecc71" />
                    <line x1="150" y1="210" x2="350" y2="210" stroke="white" stroke-width="1" />
                    <text x="250" y="200" text-anchor="middle" font-size="16" fill="white">Car</text>
                    <text x="160" y="230" font-size="12" fill="white">- numDoors</text>
                    <text x="160" y="250" font-size="12" fill="white">- type = "Car"</text>
                    <line x1="150" y1="260" x2="350" y2="260" stroke="white" stroke-width="1" />
                    <text x="160" y="280" font-size="12" fill="white">+ drive()</text>
                    
                    <!-- Instance -->
                    <rect x="400" y="180" width="150" height="110" rx="5" fill="#f1c40f" />
                    <text x="475" y="200" text-anchor="middle" font-size="14" fill="#333">myCar</text>
                    <line x1="400" y1="210" x2="550" y2="210" stroke="#333" stroke-width="1" />
                    <text x="410" y="230" font-size="12" fill="#333">make: "Toyota"</text>
                    <text x="410" y="250" font-size="12" fill="#333">model: "Corolla"</text>
                    <text x="410" y="270" font-size="12" fill="#333">year: 2020</text>
                    <text x="410" y="290" font-size="12" fill="#333">numDoors: 4</text>
                    
                    <!-- Instance Creation -->
                    <line x1="350" y1="230" x2="400" y2="230" stroke="#34495e" stroke-width="2" stroke-dasharray="5,3" />
                    <text x="375" y="220" text-anchor="middle" font-size="12" fill="#34495e">creates</text>
                </svg>
                `
            }
        }
    },
    'decorators': {
        'python': {
            code: `# Python Decorators Example: Timing function execution
import time
import functools

# A decorator to measure execution time
def timer_decorator(func):
    @functools.wraps(func)  # Preserves function metadata
    def wrapper(*args, **kwargs):
        # Record start time
        start_time = time.time()
        
        # Call the original function
        result = func(*args, **kwargs)
        
        # Record end time
        end_time = time.time()
        
        # Calculate execution time
        execution_time = end_time - start_time
        
        # Print execution time
        print(f"Function {func.__name__} took {execution_time:.4f} seconds to run")
        
        # Return the original result
        return result
    
    return wrapper

# Apply decorator to a function
@timer_decorator
def calculate_fibonacci(n):
    """Calculate the nth Fibonacci number recursively."""
    if n <= 1:
        return n
    else:
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Test the decorated function
print(f"Result: {calculate_fibonacci(30)}")`,
            realWorld: {
                title: "Enhancing Code with Decorators",
                subtitle: "How decorators improve web APIs, caching, and performance monitoring",
                description: `
                <p>Decorators are a powerful feature in Python that allow you to modify or enhance functions without changing their code. They're widely used in web frameworks, caching systems, and performance monitoring.</p>
                
                <p>In this example:</p>
                <ul>
                    <li>We create a <strong>timer_decorator</strong> that measures how long a function takes to execute</li>
                    <li>The decorator wraps around the original function, adding timing functionality</li>
                    <li>We apply it to a recursive Fibonacci calculation function</li>
                </ul>
                
                <p>Real-world applications of decorators include:</p>
                <ul>
                    <li><strong>Web Frameworks</strong>: Flask and Django use decorators for routing (e.g., @app.route('/home'))</li>
                    <li><strong>Authentication</strong>: Protecting routes with @login_required decorators</li>
                    <li><strong>Caching</strong>: Using @cache decorators to store results and avoid recalculation</li>
                    <li><strong>Logging</strong>: Adding automatic logging to functions with @log decorators</li>
                    <li><strong>Rate Limiting</strong>: Controlling API access with @rate_limit decorators</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="320" xmlns="http://www.w3.org/2000/svg">
                    <!-- Original Function -->
                    <rect x="50" y="60" width="120" height="60" rx="5" fill="#3498db" />
                    <text x="110" y="95" text-anchor="middle" font-size="14" fill="white">calculate_fibonacci(n)</text>
                    
                    <!-- Decorator -->
                    <rect x="200" y="10" width="220" height="160" rx="5" fill="#e74c3c" />
                    <text x="310" y="35" text-anchor="middle" font-size="16" fill="white">@timer_decorator</text>
                    <line x1="200" y1="50" x2="420" y2="50" stroke="white" stroke-width="1" />
                    
                    <!-- Decorator Steps -->
                    <text x="210" y="70" font-size="12" fill="white">1. Record start time</text>
                    <text x="210" y="95" font-size="12" fill="white">2. Call original function</text>
                    <text x="210" y="120" font-size="12" fill="white">3. Record end time</text>
                    <text x="210" y="145" font-size="12" fill="white">4. Print execution time</text>
                    
                    <!-- Flow Arrows -->
                    <line x1="170" y1="90" x2="200" y2="90" stroke="#34495e" stroke-width="2" />
                    <polygon points="200,90 190,85 190,95" fill="#34495e" />
                    
                    <line x1="420" y1="90" x2="450" y2="90" stroke="#34495e" stroke-width="2" />
                    <polygon points="450,90 440,85 440,95" fill="#34495e" />
                    
                    <!-- Result -->
                    <rect x="450" y="60" width="120" height="60" rx="5" fill="#2ecc71" />
                    <text x="510" y="95" text-anchor="middle" font-size="14" fill="white">Result: 832040</text>
                    
                    <!-- Explanation -->
                    <text x="180" y="210" font-size="14" fill="#333">Without changing the original function's code,</text>
                    <text x="180" y="230" font-size="14" fill="#333">the decorator adds timing measurement functionality.</text>
                    
                    <!-- Time measurement -->
                    <rect x="100" y="260" width="420" height="40" rx="5" fill="#f1c40f" />
                    <text x="310" y="285" text-anchor="middle" font-size="14" fill="#333">Function calculate_fibonacci took 0.3251 seconds to run</text>
                </svg>
                `
            }
        },
        'javascript': {
            code: `// JavaScript Decorators Example (Using ES Next experimental feature)
// Note: Decorators are a stage 3 proposal for JavaScript

// A decorator function to measure execution time
function timerDecorator(target, name, descriptor) {
    // Save a reference to the original method
    const originalMethod = descriptor.value;
    
    // Replace the original method with a new one
    descriptor.value = function(...args) {
        // Record start time
        const startTime = performance.now();
        
        // Call the original method
        const result = originalMethod.apply(this, args);
        
        // Record end time
        const endTime = performance.now();
        
        // Calculate execution time
        const executionTime = endTime - startTime;
        
        // Log execution time
        console.log(`Method ${name} took ${executionTime.toFixed(4)} milliseconds to run`);
        
        // Return the original result
        return result;
    };
    
    return descriptor;
}

// Example class with a decorated method
class FibonacciCalculator {
    // Apply decorator to method
    @timerDecorator
    calculateFibonacci(n) {
        if (n <= 1) {
            return n;
        } else {
            return this.calculateFibonacci(n-1) + this.calculateFibonacci(n-2);
        }
    }
}

// Test the decorated method
const calculator = new FibonacciCalculator();
console.log(`Result: ${calculator.calculateFibonacci(20)}`);

// Note: Since JavaScript decorators are experimental,
// you would need Babel or TypeScript to run this code.`,
            realWorld: {
                title: "Enhancing Methods with Decorators",
                subtitle: "How JavaScript decorators enhance frameworks like Angular and class-based applications",
                description: `
                <p>JavaScript decorators (still experimental in plain JS but fully supported in TypeScript) are used extensively in frameworks like Angular and are inspired by Python's decorator pattern.</p>
                
                <p>In this example:</p>
                <ul>
                    <li>We create a <strong>timerDecorator</strong> that measures how long a method takes to execute</li>
                    <li>The decorator modifies the method descriptor to wrap the original behavior with timing code</li>
                    <li>We apply it to a method in a class for calculating Fibonacci numbers</li>
                </ul>
                
                <p>Real-world applications of JavaScript decorators include:</p>
                <ul>
                    <li><strong>Angular Framework</strong>: Uses decorators like @Component, @NgModule, and @Injectable</li>
                    <li><strong>TypeScript Metadata</strong>: Using @Reflect.metadata decorators for runtime type information</li>
                    <li><strong>Mobx State Management</strong>: @observable and @computed decorators</li>
                    <li><strong>Class Validation</strong>: Using class-validator library with @IsEmail, @MinLength, etc.</li>
                    <li><strong>ORM Libraries</strong>: TypeORM uses decorators like @Entity and @Column</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="320" xmlns="http://www.w3.org/2000/svg">
                    <!-- Class Definition -->
                    <rect x="50" y="30" width="180" height="120" rx="5" fill="#3498db" />
                    <text x="140" y="55" text-anchor="middle" font-size="16" fill="white">FibonacciCalculator</text>
                    <line x1="50" y1="70" x2="230" y2="70" stroke="white" stroke-width="1" />
                    <text x="70" y="95" font-size="14" fill="white">calculateFibonacci(n)</text>
                    <text x="90" y="125" font-size="12" fill="white">// Recursive calculation</text>
                    
                    <!-- Decorator Indicator -->
                    <rect x="60" y="10" width="130" height="25" rx="5" fill="#e74c3c" />
                    <text x="125" y="27" text-anchor="middle" font-size="14" fill="white">@timerDecorator</text>
                    
                    <!-- Decorator Function -->
                    <rect x="280" y="30" width="220" height="180" rx="5" fill="#e74c3c" />
                    <text x="390" y="55" text-anchor="middle" font-size="16" fill="white">timerDecorator</text>
                    <line x1="280" y1="70" x2="500" y2="70" stroke="white" stroke-width="1" />
                    <text x="290" y="90" font-size="12" fill="white">1. Save original method</text>
                    <text x="290" y="115" font-size="12" fill="white">2. Replace with wrapper:</text>
                    <text x="310" y="135" font-size="12" fill="white">- Record start time</text>
                    <text x="310" y="155" font-size="12" fill="white">- Call original method</text>
                    <text x="310" y="175" font-size="12" fill="white">- Record end time</text>
                    <text x="310" y="195" font-size="12" fill="white">- Log execution time</text>
                    
                    <!-- Flow Arrows -->
                    <line x1="230" y1="90" x2="280" y2="90" stroke="#34495e" stroke-width="2" />
                    <polygon points="280,90 270,85 270,95" fill="#34495e" />
                    <text x="255" y="80" font-size="12" fill="#34495e">modifies</text>
                    
                    <!-- Execution Example -->
                    <rect x="100" y="230" width="400" height="80" rx="5" fill="#2ecc71" />
                    <text x="300" y="255" text-anchor="middle" font-size="16" fill="#333">Execution</text>
                    <line x1="100" y1="265" x2="500" y2="265" stroke="#333" stroke-width="1" />
                    <text x="120" y="285" font-size="14" fill="#333">calculator.calculateFibonacci(20)</text>
                    <text x="120" y="305" font-size="14" fill="#333">Method calculateFibonacci took 15.2738 milliseconds to run</text>
                </svg>
                `
            }
        },
        'java': {
            code: `// Java Annotations (Java's version of decorators)
import java.lang.annotation.*;
import java.lang.reflect.*;

// Define custom annotation
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface Timer {
    // No parameters for this simple example
}

// Implementation of annotation processor
class TimerAspect {
    public static Object timeMethod(Method method, Object[] args, Object target) throws Exception {
        // Record start time
        long startTime = System.currentTimeMillis();
        
        try {
            // Invoke the original method
            return method.invoke(target, args);
        } finally {
            // Record end time
            long endTime = System.currentTimeMillis();
            
            // Calculate execution time
            long executionTime = endTime - startTime;
            
            // Print execution time
            System.out.println("Method " + method.getName() + 
                              " took " + executionTime + "ms to run");
        }
    }
}

// Example class with annotated method
class FibonacciCalculator {
    @Timer
    public int calculateFibonacci(int n) {
        if (n <= 1) {
            return n;
        } else {
            return calculateFibonacci(n-1) + calculateFibonacci(n-2);
        }
    }
}

// Main class with proxy implementation
public class AnnotationDemo {
    public static void main(String[] args) {
        try {
            // Create dynamic proxy for our calculator
            FibonacciCalculator calculator = createTimedCalculator();
            
            // Call the timed method
            int result = calculator.calculateFibonacci(20);
            System.out.println("Result: " + result);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // Method to create proxy that processes the @Timer annotation
    private static FibonacciCalculator createTimedCalculator() {
        FibonacciCalculator realCalculator = new FibonacciCalculator();
        
        // Create proxy with invocation handler
        return (FibonacciCalculator) Proxy.newProxyInstance(
            FibonacciCalculator.class.getClassLoader(),
            new Class<?>[] { FibonacciCalculator.class },
            (proxy, method, args) -> {
                // Check if method has @Timer annotation
                if (method.isAnnotationPresent(Timer.class)) {
                    // Apply timing aspect
                    return TimerAspect.timeMethod(
                        realCalculator.getClass().getMethod(
                            method.getName(), 
                            method.getParameterTypes()
                        ), 
                        args, 
                        realCalculator
                    );
                } else {
                    // Call method normally
                    return method.invoke(realCalculator, args);
                }
            }
        );
    }
}`,
            realWorld: {
                title: "Enhancing Methods with Java Annotations",
                subtitle: "How annotations power enterprise Java frameworks and applications",
                description: `
                <p>Java uses annotations (starting with @ symbol) as its equivalent of decorators. They're a cornerstone of modern Java frameworks and are processed using reflection and proxies.</p>
                
                <p>In this example:</p>
                <ul>
                    <li>We create a custom <strong>@Timer</strong> annotation</li>
                    <li>We use a dynamic proxy to intercept method calls and apply timing behavior</li>
                    <li>We apply the annotation to a Fibonacci calculation method</li>
                </ul>
                
                <p>Real-world applications of Java annotations include:</p>
                <ul>
                    <li><strong>Spring Framework</strong>: Uses annotations like @Controller, @Service, and @Autowired</li>
                    <li><strong>Jakarta EE</strong>: Uses @Entity, @WebServlet, and many others</li>
                    <li><strong>JUnit Testing</strong>: Uses @Test, @Before, and @After annotations</li>
                    <li><strong>Lombok</strong>: Uses @Getter, @Setter, and @Builder to reduce boilerplate</li>
                    <li><strong>Hibernate ORM</strong>: Uses @Entity, @Column, and @ManyToOne for database mapping</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="380" xmlns="http://www.w3.org/2000/svg">
                    <!-- Annotation Definition -->
                    <rect x="50" y="10" width="220" height="80" rx="5" fill="#e74c3c" />
                    <text x="160" y="35" text-anchor="middle" font-size="16" fill="white">@Timer Annotation</text>
                    <line x1="50" y1="50" x2="270" y2="50" stroke="white" stroke-width="1" />
                    <text x="70" y="70" font-size="12" fill="white">@Retention(RetentionPolicy.RUNTIME)</text>
                    <text x="70" y="85" font-size="12" fill="white">@Target(ElementType.METHOD)</text>
                    
                    <!-- Class with Annotated Method -->
                    <rect x="50" y="120" width="220" height="100" rx="5" fill="#3498db" />
                    <text x="160" y="145" text-anchor="middle" font-size="16" fill="white">FibonacciCalculator</text>
                    <line x1="50" y1="160" x2="270" y2="160" stroke="white" stroke-width="1" />
                    <text x="70" y="175" font-size="12" fill="white">@Timer</text>
                    <text x="70" y="195" font-size="12" fill="white">calculateFibonacci(int n)</text>
                    
                    <!-- Dynamic Proxy -->
                    <rect x="340" y="120" width="220" height="100" rx="5" fill="#2ecc71" />
                    <text x="450" y="145" text-anchor="middle" font-size="16" fill="white">Dynamic Proxy</text>
                    <line x1="340" y1="160" x2="560" y2="160" stroke="white" stroke-width="1" />
                    <text x="350" y="175" font-size="12" fill="white">1. Intercept method calls</text>
                    <text x="350" y="195" font-size="12" fill="white">2. Apply timing for @Timer methods</text>
                    <text x="350" y="215" font-size="12" fill="white">3. Forward to real implementation</text>
                    
                    <!-- Flow Arrows -->
                    <line x1="270" y1="170" x2="340" y2="170" stroke="#34495e" stroke-width="2" />
                    <polygon points="340,170 330,165 330,175" fill="#34495e" />
                    <text x="305" y="160" font-size="12" fill="#34495e">wraps</text>
                    
                    <!-- TimerAspect -->
                    <rect x="340" y="10" width="220" height="80" rx="5" fill="#9b59b6" />
                    <text x="450" y="35" text-anchor="middle" font-size="16" fill="white">TimerAspect</text>
                    <line x1="340" y1="50" x2="560" y2="50" stroke="white" stroke-width="1" />
                    <text x="350" y="70" font-size="12" fill="white">- Measure start/end time</text>
                    <text x="350" y="85" font-size="12" fill="white">- Log execution duration</text>
                    
                    <!-- Execution Result -->
                    <rect x="150" y="250" width="400" height="80" rx="5" fill="#f1c40f" />
                    <text x="350" y="275" text-anchor="middle" font-size="16" fill="#333">Execution Result</text>
                    <line x1="150" y1="285" x2="550" y2="285" stroke="#333" stroke-width="1" />
                    <text x="170" y="305" font-size="14" fill="#333">Method calculateFibonacci took 127ms to run</text>
                    <text x="170" y="325" font-size="14" fill="#333">Result: 6765</text>
                    
                    <!-- Connection to Aspect -->
                    <line x1="450" y1="90" x2="450" y2="120" stroke="#34495e" stroke-width="2" />
                    <polygon points="450,120 445,110 455,110" fill="#34495e" />
                    <text x="470" y="105" font-size="12" fill="#34495e">uses</text>
                </svg>
                `
            }
        }
    },
    'functions': {
        'python': {
            code: `# Functions Example: Building a Temperature Converter

# Function to convert Celsius to Fahrenheit
def celsius_to_fahrenheit(celsius):
    """
    Convert temperature from Celsius to Fahrenheit.
    
    Formula: F = (C × 9/5) + 32
    
    Args:
        celsius (float): Temperature in Celsius
        
    Returns:
        float: Temperature in Fahrenheit
    """
    return (celsius * 9/5) + 32

# Function to convert Fahrenheit to Celsius
def fahrenheit_to_celsius(fahrenheit):
    """
    Convert temperature from Fahrenheit to Celsius.
    
    Formula: C = (F - 32) × 5/9
    
    Args:
        fahrenheit (float): Temperature in Fahrenheit
        
    Returns:
        float: Temperature in Celsius
    """
    return (fahrenheit - 32) * 5/9

# Function to convert temperature between units
def convert_temperature(temp, from_unit, to_unit):
    """
    Convert temperature between different units.
    
    Args:
        temp (float): Temperature value to convert
        from_unit (str): Original unit ('C', 'F', or 'K')
        to_unit (str): Target unit ('C', 'F', or 'K')
        
    Returns:
        float: Converted temperature
    """
    # Standardize units to uppercase
    from_unit = from_unit.upper()
    to_unit = to_unit.upper()
    
    # Return original value if units are the same
    if from_unit == to_unit:
        return temp
    
    # First convert to Celsius as a common format
    if from_unit == 'F':
        celsius = fahrenheit_to_celsius(temp)
    elif from_unit == 'K':
        celsius = temp - 273.15
    else:  # Already Celsius
        celsius = temp
    
    # Then convert from Celsius to target unit
    if to_unit == 'F':
        return celsius_to_fahrenheit(celsius)
    elif to_unit == 'K':
        return celsius + 273.15
    else:  # Return Celsius
        return celsius

# Example usage
temperature = 25  # Original temperature
original_unit = 'C'  # Celsius
target_unit = 'F'  # Fahrenheit

converted = convert_temperature(temperature, original_unit, target_unit)
print(f"{temperature}°{original_unit} is equal to {converted:.2f}°{target_unit}")

# Try other conversions
print(f"32°F is equal to {convert_temperature(32, 'F', 'C'):.2f}°C")
print(f"100°C is equal to {convert_temperature(100, 'C', 'K'):.2f}K")`,
            realWorld: {
                title: "Building a Temperature Conversion Tool",
                subtitle: "How functions organize code in real-world applications",
                description: `
                <p>Functions are the fundamental building blocks of programming that allow you to organize code, make it reusable, and break down complex problems into smaller, manageable parts.</p>
                
                <p>In this example, we've built a temperature conversion system that shows:</p>
                <ul>
                    <li><strong>Simple Functions</strong>: Basic converters between Celsius and Fahrenheit</li>
                    <li><strong>Composite Function</strong>: A higher-level function that uses the basic converters</li>
                    <li><strong>Documentation</strong>: Using docstrings to explain purpose and parameters</li>
                    <li><strong>Input Validation</strong>: Handling different input formats (uppercase/lowercase)</li>
                </ul>
                
                <p>This pattern is used in real-world applications like:</p>
                <ul>
                    <li><strong>Weather Apps</strong>: Converting between temperature units based on user preferences</li>
                    <li><strong>Scientific Software</strong>: Handling unit conversions for calculations</li>
                    <li><strong>International E-commerce</strong>: Displaying measurements in local units</li>
                    <li><strong>IoT Temperature Sensors</strong>: Converting readings to different units</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="340" xmlns="http://www.w3.org/2000/svg">
                    <!-- Main Conversion Function -->
                    <rect x="200" y="10" width="220" height="100" rx="5" fill="#3498db" />
                    <text x="310" y="35" text-anchor="middle" font-size="16" fill="white">convert_temperature()</text>
                    <line x1="200" y1="50" x2="420" y2="50" stroke="white" stroke-width="1" />
                    <text x="210" y="70" font-size="12" fill="white">Input: temp, from_unit, to_unit</text>
                    <text x="210" y="90" font-size="12" fill="white">Output: converted temperature</text>
                    
                    <!-- Helper Functions -->
                    <rect x="50" y="160" width="200" height="80" rx="5" fill="#2ecc71" />
                    <text x="150" y="185" text-anchor="middle" font-size="14" fill="white">celsius_to_fahrenheit()</text>
                    <line x1="50" y1="200" x2="250" y2="200" stroke="white" stroke-width="1" />
                    <text x="60" y="220" font-size="12" fill="white">Formula: F = (C × 9/5) + 32</text>
                    
                    <rect x="370" y="160" width="200" height="80" rx="5" fill="#2ecc71" />
                    <text x="470" y="185" text-anchor="middle" font-size="14" fill="white">fahrenheit_to_celsius()</text>
                    <line x1="370" y1="200" x2="570" y2="200" stroke="white" stroke-width="1" />
                    <text x="380" y="220" font-size="12" fill="white">Formula: C = (F - 32) × 5/9</text>
                    
                    <!-- Function Call Arrows -->
                    <line x1="200" y1="110" x2="150" y2="160" stroke="#34495e" stroke-width="2" />
                    <polygon points="150,160 155,150 145,150" fill="#34495e" />
                    
                    <line x1="420" y1="110" x2="470" y2="160" stroke="#34495e" stroke-width="2" />
                    <polygon points="470,160 465,150 475,150" fill="#34495e" />
                    
                    <!-- Example Outputs -->
                    <rect x="50" y="270" width="520" height="70" rx="5" fill="#f1c40f" />
                    <text x="310" y="295" text-anchor="middle" font-size="16" fill="#333">Conversion Results</text>
                    <line x1="50" y1="310" x2="570" y2="310" stroke="#333" stroke-width="1" />
                    <text x="70" y="330" font-size="14" fill="#333">25°C is equal to 77.00°F</text>
                    <text x="320" y="330" font-size="14" fill="#333">32°F is equal to 0.00°C</text>
                </svg>
                `
            }
        },
        'javascript': {
            code: `// Functions Example: Building a Temperature Converter

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    /**
     * Convert temperature from Celsius to Fahrenheit.
     * 
     * Formula: F = (C × 9/5) + 32
     * 
     * @param {number} celsius - Temperature in Celsius
     * @returns {number} Temperature in Fahrenheit
     */
    return (celsius * 9/5) + 32;
}

// Function to convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
    /**
     * Convert temperature from Fahrenheit to Celsius.
     * 
     * Formula: C = (F - 32) × 5/9
     * 
     * @param {number} fahrenheit - Temperature in Fahrenheit
     * @returns {number} Temperature in Celsius
     */
    return (fahrenheit - 32) * 5/9;
}

// Function to convert temperature between units
function convertTemperature(temp, fromUnit, toUnit) {
    /**
     * Convert temperature between different units.
     * 
     * @param {number} temp - Temperature value to convert
     * @param {string} fromUnit - Original unit ('C', 'F', or 'K')
     * @param {string} toUnit - Target unit ('C', 'F', or 'K')
     * @returns {number} Converted temperature
     */
    // Standardize units to uppercase
    fromUnit = fromUnit.toUpperCase();
    toUnit = toUnit.toUpperCase();
    
    // Return original value if units are the same
    if (fromUnit === toUnit) {
        return temp;
    }
    
    // First convert to Celsius as a common format
    let celsius;
    if (fromUnit === 'F') {
        celsius = fahrenheitToCelsius(temp);
    } else if (fromUnit === 'K') {
        celsius = temp - 273.15;
    } else {  // Already Celsius
        celsius = temp;
    }
    
    // Then convert from Celsius to target unit
    if (toUnit === 'F') {
        return celsiusToFahrenheit(celsius);
    } else if (toUnit === 'K') {
        return celsius + 273.15;
    } else {  // Return Celsius
        return celsius;
    }
}

// Example usage
const temperature = 25;  // Original temperature
const originalUnit = 'C';  // Celsius
const targetUnit = 'F';  // Fahrenheit

const converted = convertTemperature(temperature, originalUnit, targetUnit);
console.log(`${temperature}°${originalUnit} is equal to ${converted.toFixed(2)}°${targetUnit}`);

// Try other conversions
console.log(`32°F is equal to ${convertTemperature(32, 'F', 'C').toFixed(2)}°C`);
console.log(`100°C is equal to ${convertTemperature(100, 'C', 'K').toFixed(2)}K`);`,
            realWorld: {
                title: "Building a Temperature Conversion Tool",
                subtitle: "How JavaScript functions organize code in web applications",
                description: `
                <p>Functions in JavaScript are versatile and allow for both object-oriented and functional programming approaches. They're the core building blocks for web applications, giving structure and reusability to your code.</p>
                
                <p>In this example, we've built a temperature conversion system that shows:</p>
                <ul>
                    <li><strong>Basic Functions</strong>: Simple converters for specific temperature units</li>
                    <li><strong>Higher-Order Function</strong>: A main function that orchestrates the conversion process</li>
                    <li><strong>JSDoc Documentation</strong>: Using standard JavaScript documentation format</li>
                    <li><strong>Input Validation</strong>: Handling different input formats (uppercase/lowercase)</li>
                </ul>
                
                <p>This pattern is used in real-world web applications like:</p>
                <ul>
                    <li><strong>Weather Dashboards</strong>: Showing temperatures in user's preferred units</li>
                    <li><strong>Cooking Recipe Converters</strong>: Converting between Fahrenheit and Celsius for international recipes</li>
                    <li><strong>Fitness Trackers</strong>: Converting between different measurement units</li>
                    <li><strong>Travel Applications</strong>: Showing local temperatures in tourist's preferred units</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="340" xmlns="http://www.w3.org/2000/svg">
                    <!-- Main Conversion Function -->
                    <rect x="200" y="10" width="220" height="100" rx="5" fill="#3498db" />
                    <text x="310" y="35" text-anchor="middle" font-size="16" fill="white">convertTemperature()</text>
                    <line x1="200" y1="50" x2="420" y2="50" stroke="white" stroke-width="1" />
                    <text x="210" y="70" font-size="12" fill="white">Input: temp, fromUnit, toUnit</text>
                    <text x="210" y="90" font-size="12" fill="white">Output: converted temperature</text>
                    
                    <!-- Helper Functions -->
                    <rect x="50" y="160" width="200" height="80" rx="5" fill="#2ecc71" />
                    <text x="150" y="185" text-anchor="middle" font-size="14" fill="white">celsiusToFahrenheit()</text>
                    <line x1="50" y1="200" x2="250" y2="200" stroke="white" stroke-width="1" />
                    <text x="60" y="220" font-size="12" fill="white">Formula: F = (C × 9/5) + 32</text>
                    
                    <rect x="370" y="160" width="200" height="80" rx="5" fill="#2ecc71" />
                    <text x="470" y="185" text-anchor="middle" font-size="14" fill="white">fahrenheitToCelsius()</text>
                    <line x1="370" y1="200" x2="570" y2="200" stroke="white" stroke-width="1" />
                    <text x="380" y="220" font-size="12" fill="white">Formula: C = (F - 32) × 5/9</text>
                    
                    <!-- Function Call Arrows -->
                    <line x1="200" y1="110" x2="150" y2="160" stroke="#34495e" stroke-width="2" />
                    <polygon points="150,160 155,150 145,150" fill="#34495e" />
                    
                    <line x1="420" y1="110" x2="470" y2="160" stroke="#34495e" stroke-width="2" />
                    <polygon points="470,160 465,150 475,150" fill="#34495e" />
                    
                    <!-- Example Outputs -->
                    <rect x="50" y="270" width="520" height="70" rx="5" fill="#f1c40f" />
                    <text x="310" y="295" text-anchor="middle" font-size="16" fill="#333">Browser Console Output</text>
                    <line x1="50" y1="310" x2="570" y2="310" stroke="#333" stroke-width="1" />
                    <text x="70" y="330" font-size="14" fill="#333">25°C is equal to 77.00°F</text>
                    <text x="320" y="330" font-size="14" fill="#333">32°F is equal to 0.00°C</text>
                </svg>
                `
            }
        },
        'java': {
            code: `// Functions (Methods) Example: Building a Temperature Converter
public class TemperatureConverter {
    
    /**
     * Convert temperature from Celsius to Fahrenheit.
     * 
     * Formula: F = (C × 9/5) + 32
     * 
     * @param celsius Temperature in Celsius
     * @return Temperature in Fahrenheit
     */
    public static double celsiusToFahrenheit(double celsius) {
        return (celsius * 9/5) + 32;
    }
    
    /**
     * Convert temperature from Fahrenheit to Celsius.
     * 
     * Formula: C = (F - 32) × 5/9
     * 
     * @param fahrenheit Temperature in Fahrenheit
     * @return Temperature in Celsius
     */
    public static double fahrenheitToCelsius(double fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }
    
    /**
     * Convert temperature between different units.
     * 
     * @param temp Temperature value to convert
     * @param fromUnit Original unit ('C', 'F', or 'K')
     * @param toUnit Target unit ('C', 'F', or 'K')
     * @return Converted temperature
     */
    public static double convertTemperature(double temp, char fromUnit, char toUnit) {
        // Standardize units to uppercase
        fromUnit = Character.toUpperCase(fromUnit);
        toUnit = Character.toUpperCase(toUnit);
        
        // Return original value if units are the same
        if (fromUnit == toUnit) {
            return temp;
        }
        
        // First convert to Celsius as a common format
        double celsius;
        if (fromUnit == 'F') {
            celsius = fahrenheitToCelsius(temp);
        } else if (fromUnit == 'K') {
            celsius = temp - 273.15;
        } else {  // Already Celsius
            celsius = temp;
        }
        
        // Then convert from Celsius to target unit
        if (toUnit == 'F') {
            return celsiusToFahrenheit(celsius);
        } else if (toUnit == 'K') {
            return celsius + 273.15;
        } else {  // Return Celsius
            return celsius;
        }
    }
    
    // Main method to demonstrate the temperature converter
    public static void main(String[] args) {
        double temperature = 25;  // Original temperature
        char originalUnit = 'C';  // Celsius
        char targetUnit = 'F';    // Fahrenheit
        
        double converted = convertTemperature(temperature, originalUnit, targetUnit);
        System.out.printf("%.1f°%s is equal to %.2f°%s%n", 
            temperature, originalUnit, converted, targetUnit);
        
        // Try other conversions
        System.out.printf("32°F is equal to %.2f°C%n", 
            convertTemperature(32, 'F', 'C'));
        System.out.printf("100°C is equal to %.2f K%n", 
            convertTemperature(100, 'C', 'K'));
    }
}`,
            realWorld: {
                title: "Building a Temperature Conversion Library",
                subtitle: "How Java methods organize code in enterprise applications",
                description: `
                <p>In Java, functions are called "methods" and are always part of a class. This structure enforces good organization and encapsulation principles, making Java ideal for large enterprise applications.</p>
                
                <p>In this example, we've built a temperature conversion system that shows:</p>
                <ul>
                    <li><strong>Static Methods</strong>: Utility functions that don't require object instances</li>
                    <li><strong>Javadoc Documentation</strong>: Using standard Java documentation format</li>
                    <li><strong>Type Safety</strong>: Explicit parameter and return types</li>
                    <li><strong>Input Validation</strong>: Handling different input formats</li>
                </ul>
                
                <p>This pattern is used in real-world applications like:</p>
                <ul>
                    <li><strong>Scientific Applications</strong>: Precise calculations with unit conversions</li>
                    <li><strong>Android Weather Apps</strong>: Converting between temperature scales</li>
                    <li><strong>Industrial Control Systems</strong>: Processing sensor data</li>
                    <li><strong>Enterprise Data Processing</strong>: Standardizing measurement units</li>
                </ul>
                `,
                visualization: `
                <svg width="100%" height="340" xmlns="http://www.w3.org/2000/svg">
                    <!-- Class Rectangle -->
                    <rect x="50" y="10" width="520" height="50" rx="5" fill="#9b59b6" />
                    <text x="310" y="40" text-anchor="middle" font-size="18" fill="white">TemperatureConverter Class</text>
                    
                    <!-- Main Conversion Method -->
                    <rect x="200" y="80" width="220" height="100" rx="5" fill="#3498db" />
                    <text x="310" y="105" text-anchor="middle" font-size="16" fill="white">convertTemperature()</text>
                    <line x1="200" y1="120" x2="420" y2="120" stroke="white" stroke-width="1" />
                    <text x="210" y="140" font-size="12" fill="white">Input: temp, fromUnit, toUnit</text>
                    <text x="210" y="160" font-size="12" fill="white">Output: converted temperature</text>
                    
                    <!-- Helper Methods -->
                    <rect x="50" y="210" width="200" height="80" rx="5" fill="#2ecc71" />
                    <text x="150" y="235" text-anchor="middle" font-size="14" fill="white">celsiusToFahrenheit()</text>
                    <line x1="50" y1="250" x2="250" y2="250" stroke="white" stroke-width="1" />
                    <text x="60" y="270" font-size="12" fill="white">Formula: F = (C × 9/5) + 32</text>
                    
                    <rect x="370" y="210" width="200" height="80" rx="5" fill="#2ecc71" />
                    <text x="470" y="235" text-anchor="middle" font-size="14" fill="white">fahrenheitToCelsius()</text>
                    <line x1="370" y1="250" x2="570" y2="250" stroke="white" stroke-width="1" />
                    <text x="380" y="270" font-size="12" fill="white">Formula: C = (F - 32) × 5/9</text>
                    
                    <!-- Method Call Arrows -->
                    <line x1="200" y1="180" x2="150" y2="210" stroke="#34495e" stroke-width="2" />
                    <polygon points="150,210 155,200 145,200" fill="#34495e" />
                    
                    <line x1="420" y1="180" x2="470" y2="210" stroke="#34495e" stroke-width="2" />
                    <polygon points="470,210 465,200 475,200" fill="#34495e" />
                    
                    <!-- Main Method Output -->
                    <rect x="120" y="320" width="380" height="40" rx="5" fill="#f1c40f" />
                    <text x="140" y="345" font-size="14" fill="#333">25.0°C is equal to 77.00°F</text>
                    <text x="350" y="345" font-size="14" fill="#333">32°F is equal to 0.00°C</text>
                </svg>
                `
            }
        }
    }
};
