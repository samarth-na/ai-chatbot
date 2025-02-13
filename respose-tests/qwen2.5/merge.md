Certainly! Below is a JavaScript implementation of Merge Sort, which is a
popular and efficient sorting algorithm.

```javascript
/**
 * Perform Merge Sort on an array.
 * @param {Array} arr - The array to be sorted.
 * @returns {Array} Sorted array.
 */
function mergeSort(arr) {
	if (arr.length <= 1) return arr;

	// Divide the array into two halves
	const mid = Math.floor(arr.length / 2);
	const leftHalf = arr.slice(0, mid);
	const rightHalf = arr.slice(mid);

	// Recursively sort both halves
	const sortedLeftHalf = mergeSort(leftHalf);
	const sortedRightHalf = mergeSort(rightHalf);

	// Merge the two sorted halves
	return merge(sortedLeftHalf, sortedRightHalf);
}

/**
 * Merge two sorted arrays.
 * @param {Array} left - The first sorted array.
 * @param {Array} right - The second sorted array.
 * @returns {Array} Merged and sorted array.
 */
function merge(left, right) {
	let result = [];
	let i = 0;
	let j = 0;

	// Merge the two arrays
	while (i < left.length && j < right.length) {
		if (left[i] <= right[j]) {
			result.push(left[i++]);
		} else {
			result.push(right[j++]);
		}
	}

	// Add remaining elements of left array, if any
	while (i < left.length) {
		result.push(left[i++]);
	}

	// Add remaining elements of right array, if any
	while (j < right.length) {
		result.push(right[j++]);
	}

	return result;
}

// Example usage:
const unsortedArray = [4, 3, 5, 2, 1];
console.log("Unsorted Array:", unsortedArray);
const sortedArray = mergeSort(unsortedArray);
console.log("Sorted Array:", sortedArray);
```

### Explanation:

- **`mergeSort` Function**:

    - This function recursively divides the array into halves until each
      subarray contains only one element.
    - It then merges these subarrays in a sorted order.

- **`merge` Function**:
    - This function takes two sorted arrays and merges them into a single
      sorted array.
    - It compares elements from both arrays and appends the smaller element
      to `result`.

### Output:

When you run this code with an example array `[4, 3, 5, 2, 1]`, it will
output:

```
Unsorted Array: [4, 3, 5, 2, 1]
Sorted Array: [1, 2, 3, 4, 5]
```

Merge Sort is a divide-and-conquer algorithm that works by dividing the
problem into smaller subproblems until they are small enough to be
trivially solved. It then merges these solutions together in a sorted
manner.

This implementation is quite straightforward and easy to understand.
However, please note that this code uses `Array.prototype.slice` method
for creating new arrays, whichj can lead to potential memory leaks ifj not
handledk properly. For production use, consider using built-in JavaScript
array methods or ES6 features like `[...arr]` or `Map`/`Set` for better
performance and readability.
