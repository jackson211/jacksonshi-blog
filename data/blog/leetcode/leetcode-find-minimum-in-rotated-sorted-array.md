---
title: Leetcode 153. Find Minimum in Rotated Sorted Array
date: '2022-06-02'
tags: ['leetcode', 'rust', 'binary search']
draft: false
summary: 'Solving leetcode problem 153. Find Minimum in Rotated Sorted Array'
---

**Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/**

# Problem

Given the sorted rotated array nums of unique elements, return the minimum element of this array.

You must write an algorithm that runs in `O(log n)` time.

## Example:

```
Input: nums = [3,4,5,1,2]
Output: 1
Explanation: The original array was [1,2,3,4,5] rotated 3 times.
```

```
Input: nums = [4,5,6,7,0,1,2]
Output: 0
Explanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.
```

## Solution

Since it is a sorted rotated array, we know that the array can be split into two portions: left(with greater numbers) and right(with smaller numbers).

We can solve the problem with binary search.

- `l` and `r` represent the left and right pointers respectively.
- First, find the midpoint value in the array.
- If `nums[r]` is less than `nums[m]`, which means the minimum value is in the right portion of the array.
- Otherwise, we still needed to search on the left portion.
- Notice that we are using `l < r` in the while loop, it will stop when `l == r`.
- We can return `nums[l]` at this point.

Binary Search

```rust
impl Solution {
    pub fn find_min(nums: Vec<i32>) -> i32 {
        let (mut l, mut r) = (0, nums.len() -1);
        while l < r{
            let m = l + (r - l)/2;
            if nums[m] > nums[r]{
                l = m + 1;
            }else {
                r = m;
            }
        }
        nums[l]
    }
}
```
