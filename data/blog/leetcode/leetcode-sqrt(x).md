---
title: Leetcode 69. Sqrt(x)
date: '2022-05-25'
tags: ['leetcode', 'rust', 'binary search']
draft: false
summary: 'Solving leetcode problem 69. Sqrt(x)'
---

**Link: https://leetcode.com/problems/sqrtx/**

# Problem

Given a non-negative integer x, compute and return the square root of x.

Since the return type is an integer, the decimal digits are truncated, and only the integer part of the result is returned.

Note: You are not allowed to use any built-in exponent function or operator, such as pow(x, 0.5) or x \*\* 0.5.

## Example:

```
Input: x = 4
Output: 2
```

```
Input: x = 8
Output: 2
Explanation: The square root of 8 is 2.82842..., and since the decimal part is truncated, 2 is returned.
```

## Solution

Brute force

```rust
impl Solution {
    pub fn my_sqrt(x: i32) -> i32 {
        if x<=1{
            return x;
        }
        for i in 1..=x{
            let ii = i as i64; // int overflow
            if ii * ii  > x as i64{
                return ii as i32 - 1;
            }
        }
        -1
    }
}
```

Binary Search

```rust
impl Solution {
    pub fn my_sqrt(x: i32) -> i32 {
        let (mut l, mut r) = (1, x);
        while l <= r{
            let m = l + (r - l) / 2;
            if m > x/m{
                r = m - 1;
            } else {
                l = m + 1;
            }
        }
        r
    }
}
```

Newton Method

```rust
impl Solution {
    pub fn my_sqrt(x: i32) -> i32 {
        if x == 0{
            return 0;
        }
        let mut x = x as i64;
        let a = x;
        while x > a/x{
            x = (x + a / x) / 2;
        }
        x as i32
    }
}
```
