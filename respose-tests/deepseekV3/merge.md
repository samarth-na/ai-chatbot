
<think>
Okay, the user asked to implement merge sort in JavaScript. I need to explain how to do that step by step.

First, I should outline the basic structure of a merge sort function. It typically takes an array as input and returns a sorted array.

I'll start with writing a compare function because it's used internally during recursion. This compares two elements and decides their order based on
their values.

Next, I'll define the main mergeSort function. Inside this function, if the array has one or zero elements, it's already sorted, so return it as is.

If there are more than two elements, I need to split the array into left and right halves. This can be done using a helper function that recursively
splits until only two elements remain.

Once I have both halves, the merge function will combine them. It initializes pointers for both subarrays and merges them back into the main array while
comparing each element.

I should also write some test cases to show how the sorted array is returned after running the function. This helps the user understand the output.

I'll mention that merge sort is stable but not a in-place algorithm since it requires extra space during merging. That's important for performance reasons
and memory usage.

Finally, I'll provide a sample code for clarity so the user can copy and test it easily.
</think>

To implement merge sort in JavaScript, we'll create a function that recursively divides and merges arrays. Here's how you can do it:

1. **Compare Function**: This is used to compare elements during the merging process.

2. **Recursive Splitting**: We split the array into two halves until each subarray contains one or zero elements.

3. **Merge Function**: This combines the two sorted subarrays back into a single sorted array.

Here's an example implementation:

```javascript
function mergeSort(array) {
    if (array.length <= 1) {
        return array; // Base case: already sorted or empty
    }

    const middle = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, middle));
    const right = mergeSort(array.slice(middle));

    return merge(left, right); // Merge the two sorted arrays
}

function compare(a, b) {
    if (a > b) return 1;
    else return -1;
}

function merge(left, right) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (compare(left[i], right[j])) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // Add remaining elements from both arrays
    result.push(...left.slice(i));
    result.push(...right.slice(j));

    return result;
}
```

### Explanation:
1. **mergeSort Function**: This is the main function that sorts an array by dividing it into halves and recursively sorting each half, then merging them
back together.

2. **split Array**: The `slice` method splits the array into two parts.

3. **Merge Process**: The merge function takes two sorted arrays and merges them into one sorted array.

4. **Compare Function**: This helper function compares two elements based on their values and returns which element should come first.

### Example Usage:
```javascript
const arr = [3, 1, 4, 2, 5];
const sortedArr = mergeSort(arr);
console.log(sortedArr); // Output: [1, 2, 3, 4, 5]
```

### Notes:
- **Time Complexity**: Merge sort has a time complexity of O(n log n), which is efficient for large datasets.
- **Space Complexity**: The space complexity is O(n) because the algorithm requires additional memory during the merging process.

You can copy and paste this code into an HTML file to test it out. The `mergeSort` function will take an array as input and return a new sorted array.
