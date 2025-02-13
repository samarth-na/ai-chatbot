
Here's an implementation of the Merge Sort algorithm in JavaScript:

```javascript
// Function to merge two sorted arrays
function merge(arr1, arr2) {
    let merged = [];
    let i = 0;
    let j = 0;

    // Merge smaller elements first
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            merged.push(arr1[i]);
            i++;
        } else {
            merged.push(arr2[j]);
            j++;
        }
    }

    // If there are remaining elements in either array, append them to
the merged array
    while (i < arr1.length) {
        merged.push(arr1[i]);
        i++;
    }

    while (j < arr2.length) {
        merged.push(arr2[j]);
        j++;
    }

    return merged;
}

// Function to implement Merge Sort
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    let mid = Math.floor(arr.length / 2);
    let leftHalf = arr.slice(0, mid);
    let rightHalf = arr.slice(mid);

    // Recursively sort both halves
    leftHalf = mergeSort(leftHalf);
    rightHalf = mergeSort(rightHalf);

    // Merge the sorted halves
    return merge(leftHalf, rightHalf);
}

// Example usage:
let numbers = [64, 34, 25, 12, 22, 11, 90];
let sortedNumbers = mergeSort(numbers);
console.log("Sorted array:", sortedNumbers);
```

This code implements a Merge Sort algorithm in JavaScript. The `merge`
function merges two sorted arrays into one sorted array. The `mergeSort`
function recursively divides the input array into smaller halves until
each half contains only one element, and then merges them back together.

Here's how it works:

1.  If the length of the input array is 1 or less, return the original
array (since it's already sorted).
2.  Find the middle index of the input array.
3.  Recursively call `mergeSort` on both halves of the input array
(leftHalf and rightHalf).
4.  Merge the sorted halves using the `merge` function.
5.  Return the merged sorted array.

You can use this implementation as a starting point to sort your own data
structures, such as arrays or linked lists.
