---
title: Leetcode 23. Merge k Sorted Lists
date: '2022-05-24'
tags: ['leetcode', 'rust', 'linkedlist']
draft: false
summary: 'Solving leetcode problem 23: Merge k Sorted Lists'
---

**Link: https://leetcode.com/problems/merge-k-sorted-lists/**

# Problem

You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

## Example:

```
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted list:
1->1->2->3->4->4->5->6
```

```
Input: lists = []
Output: []
```

```
Input: lists = [[]]
Output: []
```

## Solution

The intuitive approach is to turning the problem into merge two lists, then append to a finial result list.

Merge two lists:

```rust
impl Solution {
    pub fn merge_k_lists(mut lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        let mut res = Box::new(ListNode::new(-1));
        for i in 0..lists.len(){
            res.next = Solution::merge_two_lists(res.next, lists[i].clone());
        }
        res.next
    }

    pub fn merge_two_lists(mut list1: Option<Box<ListNode>>, mut list2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        match (list1, list2){
            (Some(l1), Some(l2)) => {
                if l1.val < l2.val{
                    return Some(Box::new(ListNode{val:l1.val, next: Solution::merge_two_lists(l1.next, Some(l2))}));
                } else{
                    return Some(Box::new(ListNode{val:l2.val, next: Solution::merge_two_lists(Some(l1), l2.next)}));
                    }
            }
            (Some(n), None) | (None, Some(n)) => Some(n),
            (None, None) => None,
        }
    }
}
```

Another approach is to store all the val in the Node from the list, then build tree from heap's `pop`.

Binary Heap:

```rust
use std::collections::BinaryHeap;

impl Solution {
    pub fn merge_k_lists(mut lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        // Store val in heap
        let mut heap = BinaryHeap::new();
        for list in lists.iter_mut(){
            while let Some(node) = list.take(){
                heap.push(node.val);
            }
        }
        // Rebuild tree
        let mut cur = None;
        while let Some(val) = heap.pop(){
            cur = Some(Box::new(ListNode{val, next: cur}));
        }
        cur
    }
}
```

Personally I think the Binary Heap solution is more clear and efficient.
