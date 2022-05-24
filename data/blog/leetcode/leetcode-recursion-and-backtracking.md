---
title: Leetcode recursion and backtracking
date: '2022-05-24'
tags: ['leetcode', 'rust', 'linkedlist']
draft: false
summary: 'A collections of leetcode problems on recursion and backtracking'
---

# List of Problems

- [39. Combination Sum](#combination-sum)
- [40. Combination Sum II](#combination-sum-ii)
- [41. Subsets](#subsets)
- [42. Subsets II](#subsets-ii)
- [43. Permutations](#permutations)
- [44. Permutations II](#permutations-ii)

# Combination Sum

**Link: https://leetcode.com/problems/combination-sum/**

## Problem

Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.

The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

It is guaranteed that the number of unique combinations that sum up to target is less than 150 combinations for the given input.

## Example:

```
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
Explanation:
2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
7 is a candidate, and 7 = 7.
These are the only two combinations.
```

```
Input: candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]
```

```
Input: candidates = [2], target = 1
Output: []
```

## Solution

```rust
impl Solution {
    pub fn combination_sum(candidates: Vec<i32>, target: i32) -> Vec<Vec<i32>> {
        fn dfs(candidates:&Vec<i32>, target:i32, i:usize, cur: &mut Vec<i32>, res:&mut Vec<Vec<i32>>){
            if target == 0 { // Found
                res.push(cur.clone());
                return;
            }  else if i>=candidates.len() || target < 0{
                return;
            }
            let c = candidates[i];
            cur.push(c);
            dfs(candidates, target - c, i, cur, res); // at i, count c
            cur.pop();
            dfs(candidates, target, i + 1, cur, res); // at i + 1, doesn't count c
        }

        let mut res = vec![];
        dfs(&candidates, target, 0, &mut vec![], &mut res);
        res
    }
}
```

# Combination Sum II

**Link: https://leetcode.com/problems/combination-sum-ii/**

## Problem

Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target.

Each number in candidates may only be used once in the combination.

Note: The solution set must not contain duplicate combinations.

## Example:

```
Input: candidates = [10,1,2,7,6,1,5], target = 8
Output:
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]
```

```
Input: candidates = [2,5,2,1,2], target = 5
Output:
[
[1,2,2],
[5]
]
```

## Solution

The difference between the Combination Sum and the Combination Sum II is that Combination Sum II require unique combinations.

We can sort the input Vec and skip repeated elements in the `candidates`.

```rust
impl Solution {
    pub fn combination_sum2(mut candidates: Vec<i32>, target: i32) -> Vec<Vec<i32>> {
        fn dfs(candidates: &Vec<i32>, target: i32, start:usize, cur: &mut Vec<i32>,  res: &mut Vec<Vec<i32>>){
            if target == 0 {
                res.push(cur.clone());
                return;
            } else if target < 0 {
                return;
            }
            for i in start..candidates.len(){
                if i > start && candidates[i] == candidates[i-1]{ // skip same elements in a sorted Vec
                    continue;
                }
                let n = candidates[i];
                cur.push(n);
                dfs(candidates, target-n, i+1, cur, res);
                cur.pop();
            }
        }
        candidates.sort();
        let mut res = vec![];
        dfs(&candidates, target, 0, &mut vec![], &mut res);
        res
    }
}
```

# Subsets

**Link: https://leetcode.com/problems/subsets/**

## Problem

Given an integer array nums of unique elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.

## Example:

```
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

```
Input: nums = [0]
Output: [[],[0]]
```

## Solution

```rust
impl Solution {
    pub fn subsets(nums: Vec<i32>) -> Vec<Vec<i32>> {
        fn dfs(nums:&Vec<i32>, start:usize, cur:&mut Vec<i32>, res:&mut Vec<Vec<i32>>){
            res.push(cur.clone());
            for i in start..nums.len(){
                cur.push(nums[i]);
                dfs(nums, i+1, cur, res);
                cur.pop();
            }
        }

        let mut res = vec![];
        dfs(&nums, 0, &mut vec![], &mut res);
        res
    }
}
```

# Subsets II

**Link: https://leetcode.com/problems/subsets/**

## Problem

Given an integer array nums that may contain duplicates, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.

## Example:

```
Input: nums = [1,2,2]
Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
```

```
Input: nums = [0]
Output: [[],[0]]
```

## Solution

Same as Combination Sum II: sort the Vec, then skip repeated elements.

```rust
impl Solution {
    pub fn subsets_with_dup(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
          fn dfs(nums:&Vec<i32>, start:usize, cur:&mut Vec<i32>, res:&mut Vec<Vec<i32>>){
            res.push(cur.clone());
            for i in start..nums.len(){
                if i > start && nums[i] == nums[i-1]{
                    continue;
                }
                cur.push(nums[i]);
                dfs(nums, i+1, cur, res);
                cur.pop();
            }
        }
        nums.sort();
        let mut res = vec![];
        dfs(&nums, 0, &mut vec![], &mut res);
        res
    }
}
```

# Permutations

**Link: https://leetcode.com/problems/permutations/**

## Problem

Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.

## Example:

```
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

```
Input: nums = [0,1]
Output: [[0,1],[1,0]]
```

```
Input: nums = [1]
Output: [[1]]
```

## Solution

Maintains a `cur` list, make sure `cur` doesn't contain duplicates;

```rust
impl Solution {
    pub fn permute(nums: Vec<i32>) -> Vec<Vec<i32>> {
        fn dfs(nums:&Vec<i32>, cur:&mut Vec<i32>, res: &mut Vec<Vec<i32>>){
            if cur.len() == nums.len(){
                res.push(cur.clone());
                return;
            }
            for i in 0..nums.len(){
                let n = nums[i];
                if cur.contains(&n){
                    continue;
                }
                cur.push(n);
                dfs(nums, cur, res);
                cur.pop();
            }
        }
        let mut res = vec![];
        dfs(&nums, &mut vec![], &mut res);
        res
    }
}
```

# Permutations II

**Link: https://leetcode.com/problems/permutations-ii/**

## Problem

Given a collection of numbers, nums, that might contain duplicates, return all possible unique permutations in any order.

## Example:

```
Input: nums = [1,1,2]
Output:
[[1,1,2],
 [1,2,1],
 [2,1,1]]
```

```
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

## Solution

Using the sort trick, but we also needed to maintain a visited list to keep tracking visited nodes.

```rust
impl Solution {
    pub fn permute_unique(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
        fn dfs(nums:&Vec<i32>, cur:&mut Vec<i32>, res: &mut Vec<Vec<i32>>, visited: &mut Vec<bool>){
            if cur.len() == nums.len(){
                res.push(cur.clone());
                return;
            }
            for i in 0..nums.len(){
                let n = nums[i];
                if visited[i]{
                    continue;
                }
                if i > 0 && n == nums[i-1] && !visited[i-1]{
                    continue;
                }
                cur.push(n);
                visited[i] = true;
                dfs(nums, cur, res, visited);
                cur.pop();
                visited[i] = false;
            }
        }
        nums.sort();
        let mut res = vec![];
        dfs(&nums, &mut vec![], &mut res, &mut vec![false; nums.len()]);
        res
    }
}
```
