/**
 * Test file with performance issues for CodeRabbit testing
 */

// Performance Issue 1: N+1 Query Problem
async function getUsersWithPosts() {
    const users = await User.findAll();
    const usersWithPosts = [];
    
    for (const user of users) {
        const posts = await Post.findAll({ where: { userId: user.id } });
        usersWithPosts.push({ ...user, posts });
    }
    
    return usersWithPosts;
}

// Performance Issue 2: Inefficient array operations
function findDuplicates(arr) {
    const duplicates = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                duplicates.push(arr[i]);
            }
        }
    }
    return duplicates;
}

// Performance Issue 3: Memory leak - no cleanup
class DataProcessor {
    constructor() {
        this.data = [];
        this.listeners = [];
    }
    
    addListener(callback) {
        this.listeners.push(callback);
        // Never removes listeners - memory leak
    }
    
    processData() {
        // Processes large amounts of data without cleanup
        for (let i = 0; i < 1000000; i++) {
            this.data.push({ id: i, value: Math.random() });
        }
    }
}

// Performance Issue 4: Synchronous file operations
function readMultipleFiles() {
    const files = ['file1.txt', 'file2.txt', 'file3.txt'];
    const contents = [];
    
    files.forEach(file => {
        // Synchronous file read - blocks event loop
        const content = fs.readFileSync(file, 'utf8');
        contents.push(content);
    });
    
    return contents;
}

// Performance Issue 5: Inefficient string concatenation
function buildLargeString(items) {
    let result = '';
    for (const item of items) {
        result += item.name + ' - ' + item.description + '\n';
    }
    return result;
}

// Performance Issue 6: Unnecessary database calls in loop
async function updateUserStats(userIds) {
    for (const userId of userIds) {
        const user = await User.findById(userId);
        const posts = await Post.count({ where: { userId } });
        const comments = await Comment.count({ where: { userId } });
        
        await User.update(
            { postCount: posts, commentCount: comments },
            { where: { id: userId } }
        );
    }
}

// Performance Issue 7: Large object in memory
function processLargeDataset() {
    const largeArray = new Array(10000000).fill(0).map((_, i) => ({
        id: i,
        data: 'x'.repeat(1000), // 1KB per item = 10GB total
        timestamp: Date.now()
    }));
    
    return largeArray.filter(item => item.id % 2 === 0);
}

// Performance Issue 8: No caching
function expensiveCalculation(input) {
    // Expensive operation that could be cached
    let result = 0;
    for (let i = 0; i < input * 1000000; i++) {
        result += Math.sqrt(i);
    }
    return result;
}

// Performance Issue 9: Blocking operations
function processRequest(req, res) {
    // CPU-intensive operation blocks event loop
    const result = fibonacci(40);
    res.json({ result });
}

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Performance Issue 10: Inefficient regex
function validateEmail(email) {
    // Very complex regex that can cause ReDoS
    const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailRegex.test(email);
}
