---
title: Leetcode 162. Find Peak Element
date: '2022-05-24'
tags: ['leetcode', 'rust', 'linkedlist']
draft: false
summary: 'Solving leetcode problem 23: Merge k Sorted Lists'
---

**Link: https://leetcode.com/problems/find-peak-element/**

# Problem

A peak element is an element that is strictly greater than its neighbors.

Given an integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.

You may imagine that nums[-1] = nums[n] = -∞.

You must write an algorithm that runs in O(log n) time.

## Example:

```
Input: nums = [1,2,3,1]
Output: 2
Explanation: 3 is a peak element and your function should return the index number 2.

```

```
Input: nums = [1,2,1,3,5,6,4]
Output: 5
Explanation: Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6.

```

## Solution

The intuitive approach is to scan the list linearly. We know the fact that two neighbour numebrs: `nums[i]` and `nums[i+1]` are never equal. We do not need to compare `nums[i]` and `nums[i-1]`. Because in a loop, we are checking every `nums[i] > nums[i+1]` for pervious `(i-1)` elements. Indicates that at current index `i`, it satisify that `nums[i-1] < nums[i]`.

In the problem description, it asks us to write an algorithm in `O(log n)` time. We can use binary search to find the midpoint in the list. If `nums[m] > nums[m+1]`, which means that we need to reduce the right bound to mid-point, and else we need to reduce the left bound to `mid + 1`.

```rust
impl Solution {
    pub fn find_peak_element(nums: Vec<i32>) -> i32 {
        let (mut l, mut r) = (0usize, nums.len() - 1);
        while l<r{
            let m = l + (r - l) / 2;
            if nums[m] > nums[m+1]{
                r = m;
            }else{
                l = m + 1;
            }
        }
        l as i32
    }
}
```
