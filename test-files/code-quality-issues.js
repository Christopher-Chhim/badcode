/**
 * Test file with code quality issues for CodeRabbit testing
 */

// Code Quality Issue 1: No error handling
function divide(a, b) {
    return a / b; // No check for division by zero
}

// Code Quality Issue 2: Magic numbers
function calculateTax(amount) {
    return amount * 0.15; // Magic number - should be a constant
}

// Code Quality Issue 3: Long function with multiple responsibilities
function processUserData(userData, paymentData, shippingData) {
    // Validates user data
    if (!userData.name || !userData.email) {
        throw new Error('Invalid user data');
    }
    
    // Processes payment
    const paymentResult = processPayment(paymentData);
    if (!paymentResult.success) {
        throw new Error('Payment failed');
    }
    
    // Calculates shipping
    const shippingCost = calculateShipping(shippingData);
    
    // Saves to database
    const user = saveUser(userData);
    const order = createOrder(user.id, paymentResult.id, shippingCost);
    
    // Sends confirmation email
    sendEmail(user.email, 'Order confirmed', `Your order ${order.id} has been created`);
    
    // Updates inventory
    updateInventory(order.items);
    
    // Logs the transaction
    logTransaction(user.id, order.id, paymentResult.id);
    
    return order;
}

// Code Quality Issue 4: Inconsistent naming
const user_name = "john";
const userEmail = "john@example.com";
const UserAge = 25;
const user_address = "123 Main St";

// Code Quality Issue 5: Dead code
function unusedFunction() {
    console.log("This function is never called");
    return "dead code";
}

function mainFunction() {
    const result = "Hello World";
    // Dead code below
    if (false) {
        console.log("This will never execute");
    }
    return result;
}

// Code Quality Issue 6: No documentation
function complexAlgorithm(data, options) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (options.filter && options.filter(item)) {
            const processed = item.value * options.multiplier;
            if (processed > options.threshold) {
                result.push({
                    id: item.id,
                    value: processed,
                    category: item.category || 'default'
                });
            }
        }
    }
    return result;
}

// Code Quality Issue 7: Global variables
var globalCounter = 0;
var globalData = [];

function incrementCounter() {
    globalCounter++;
    globalData.push(globalCounter);
}

// Code Quality Issue 8: Deeply nested code
function processOrder(order) {
    if (order) {
        if (order.items) {
            if (order.items.length > 0) {
                if (order.customer) {
                    if (order.customer.email) {
                        if (order.payment) {
                            if (order.payment.status === 'completed') {
                                if (order.shipping) {
                                    if (order.shipping.address) {
                                        return processValidOrder(order);
                                    } else {
                                        throw new Error('No shipping address');
                                    }
                                } else {
                                    throw new Error('No shipping info');
                                }
                            } else {
                                throw new Error('Payment not completed');
                            }
                        } else {
                            throw new Error('No payment info');
                        }
                    } else {
                        throw new Error('No customer email');
                    }
                } else {
                    throw new Error('No customer info');
                }
            } else {
                throw new Error('No items in order');
            }
        } else {
            throw new Error('No items property');
        }
    } else {
        throw new Error('No order provided');
    }
}

// Code Quality Issue 9: Duplicate code
function calculateRectangleArea(width, height) {
    return width * height;
}

function calculateSquareArea(side) {
    return side * side; // Duplicate of rectangle calculation
}

function calculateTriangleArea(base, height) {
    return (base * height) / 2;
}

// Code Quality Issue 10: Inconsistent return types
function getUser(id) {
    if (id < 0) {
        return null; // Returns null
    }
    if (id === 0) {
        return false; // Returns boolean
    }
    if (id > 1000) {
        return "User not found"; // Returns string
    }
    return { id, name: "User" }; // Returns object
}

// Code Quality Issue 11: No input validation
function updateUserProfile(userId, profileData) {
    // No validation of userId or profileData
    const user = database.findUser(userId);
    user.profile = profileData;
    database.saveUser(user);
    return user;
}

// Code Quality Issue 12: Hardcoded values
function getApiUrl() {
    return "https://api.example.com/v1"; // Should be configurable
}

function getDatabaseConfig() {
    return {
        host: "localhost",
        port: 5432,
        database: "myapp",
        username: "admin",
        password: "password123"
    };
}
