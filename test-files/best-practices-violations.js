/**
 * Test file with best practices violations for CodeRabbit testing
 */

// Best Practice Violation 1: Using var instead of let/const
var oldVariable = "This should use const";
var anotherVar = 42;

// Best Practice Violation 2: No semicolons (inconsistent)
const noSemicolon = "missing semicolon"
const anotherOne = "also missing"

// Best Practice Violation 3: Using == instead of ===
function compareValues(a, b) {
    if (a == b) { // Should use ===
        return true;
    }
    return false;
}

// Best Practice Violation 4: Not using strict mode
function nonStrictFunction() {
    // Missing 'use strict';
    undeclaredVariable = "This creates a global variable";
}

// Best Practice Violation 5: Callback hell (not using async/await)
function getUserData(userId, callback) {
    getUser(userId, function(err, user) {
        if (err) {
            callback(err);
        } else {
            getPosts(user.id, function(err, posts) {
                if (err) {
                    callback(err);
                } else {
                    getComments(user.id, function(err, comments) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, {
                                user: user,
                                posts: posts,
                                comments: comments
                            });
                        }
                    });
                }
            });
        }
    });
}

// Best Practice Violation 6: Not handling promises properly
function fetchData() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Missing .catch() for error handling
        });
}

// Best Practice Violation 7: Using eval() - security risk
function executeUserCode(code) {
    return eval(code); // Dangerous!
}

// Best Practice Violation 8: Not using const for immutable values
let PI = 3.14159; // Should be const
let API_URL = "https://api.example.com"; // Should be const

// Best Practice Violation 9: Mutating function parameters
function updateArray(arr) {
    arr.push("new item"); // Mutates original array
    return arr;
}

// Best Practice Violation 10: Not using template literals
function createMessage(name, age) {
    return "Hello " + name + ", you are " + age + " years old";
    // Should use: `Hello ${name}, you are ${age} years old`
}

// Best Practice Violation 11: Using console.log in production code
function processOrder(order) {
    console.log("Processing order:", order); // Should use proper logging
    // ... processing logic
    console.log("Order processed successfully"); // Should use proper logging
}

// Best Practice Violation 12: Not using meaningful variable names
function calc(a, b, c) {
    const x = a * b;
    const y = x + c;
    return y;
}

// Best Practice Violation 13: Not using arrow functions where appropriate
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function(n) {
    return n * 2;
});

// Best Practice Violation 14: Not using destructuring
function displayUser(user) {
    const name = user.name;
    const email = user.email;
    const age = user.age;
    console.log(name, email, age);
}

// Best Practice Violation 15: Not using default parameters
function createUser(name, email, isActive) {
    return {
        name: name || "Unknown",
        email: email || "no-email@example.com",
        isActive: isActive !== undefined ? isActive : true
    };
}

// Best Practice Violation 16: Not using spread operator
function mergeObjects(obj1, obj2) {
    return Object.assign({}, obj1, obj2);
}

// Best Practice Violation 17: Not using array methods properly
function findEvenNumbers(numbers) {
    const evenNumbers = [];
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] % 2 === 0) {
            evenNumbers.push(numbers[i]);
        }
    }
    return evenNumbers;
}

// Best Practice Violation 18: Not using optional chaining
function getUserName(user) {
    if (user && user.profile && user.profile.name) {
        return user.profile.name;
    }
    return "Unknown";
}

// Best Practice Violation 19: Not using nullish coalescing
function getConfigValue(key) {
    const value = process.env[key];
    return value || "default"; // Should use ??
}

// Best Practice Violation 20: Not using proper error handling
function riskyOperation() {
    try {
        // Some risky operation
        const result = JSON.parse("invalid json");
        return result;
    } catch (error) {
        // Swallowing the error - should handle it properly
    }
}
