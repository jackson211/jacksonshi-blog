---
title: 'Rc and Weak in Rust'
date: '2022-05-27'
lastmod: '2022-05-27'
tags: ['rust']
draft: false
summary: 'Exploring Rc and Weak smart pointer in Rust'
authors: ['default']
---

`Rc` stands for 'Reference Counter' in Rust. In other languages, reference counting is a common method used in garbage collection. Since there is no garbage collection in rust, but rust provides the reference counting smart pointer `Rc`.

## `Rc`

According to rust's `std::rc` documentation[^1]:

> The type `Rc<T>` provides shared ownership of a value of type `T`, allocated in the heap.Invoking `clone` on `Rc` produces a new pointer to the same allocation in the heap. When the last `Rc` pointer to a given allocation is destroyed, the value stored in that allocation (often referred to as “inner value”) is also dropped.

The `Rc` keeps track of the number of references to a value. If there are zero references to the value, the value can be cleaned up, before any references are invalid .

Remember the references rule in rust:

- You can have either one mutable reference or any number of immutable references.
- References must always be valid.

`Rc` is no exception: we can not obtain a shared mutable reference from an `Rc`.

`Rc` is not thread-safe, it uses non-atomic reference counting. `Rc` can not be sent between threads, therefore `Rc` does not implement `Send`. `Arc` is for thread-safe atomic reference counting.

**Example:**
![Rc](https://doc.rust-lang.org/book/img/trpl15-03.svg)

```rust
enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use crate::List::{Cons, Nil};
use std::rc::Rc;

fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    println!("count after creating a = {}", Rc::strong_count(&a));
    let b = Cons(3, Rc::clone(&a));
    println!("count after creating b = {}", Rc::strong_count(&a));
    {
        let c = Cons(4, Rc::clone(&a));
        println!("count after creating c = {}", Rc::strong_count(&a));
    }
    println!("count after c goes out of scope = {}", Rc::strong_count(&a));
}
```

**output:**

```bash
$ cargo run
   Compiling cons-list v0.1.0 (file:///projects/cons-list)
    Finished dev [unoptimized + debuginfo] target(s) in 0.45s
     Running `target/debug/cons-list`
count after creating a = 1
count after creating b = 2
count after creating c = 3
count after c goes out of scope = 2
```

We can see the example above: we are creating `a` that is holding `Cons(5, Rc::new(Cons(10, Rc::new(Nil))))`. `b` create a clone of `a`, and increase the number of references to 2.

Note that we are using `Rc::clone`, and calling `strong_count` on an `Rc<T>` instance. Each time we clone from reference, the count is added by one.

## Refernce Cycle

```rust
use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
struct Node {
    next: Option<Rc<RefCell<Node>>>,
}

impl Drop for Node {
    fn drop(&mut self) {
        println!("Dropping");
    }
}

fn main() {
    let a = Rc::new(RefCell::new(Node {next: None}));
    println!("a count: {:?}",  Rc::strong_count(&a));
    let b = Rc::new(RefCell::new(Node {next: Some(Rc::clone(&a))}));
    println!("a count: {:?}",  Rc::strong_count(&a));
    println!("b count: {:?}",  Rc::strong_count(&b));
    let c = Rc::new(RefCell::new(Node {next: Some(Rc::clone(&b))}));

    // Creates a reference cycle
    (*a).borrow_mut().next = Some(Rc::clone(&c));
    println!("a count: {:?}",  Rc::strong_count(&a));
    println!("b count: {:?}",  Rc::strong_count(&b));
    println!("c count: {:?}",  Rc::strong_count(&c));

    // Print a will casue stack overlfow
    // println!("a {:?}",  &a);
}
```

The code above is intended to create a reference cycle. The initial `a` is created with a `None` next, then the `b`'s next is point to `a`, and `c`'s next is point to `a`. Therefore, the `strong_count` for `a`, `b`, and `c` are both `2`.

**output:**

```bash
a count: 1
a count: 2
b count: 1
a count: 2
b count: 2
c count: 2
```

Then we assgin `a`'s next to `Some(Rc::clone(&c))`, which creates a reference cycle. If we print `a` at the bottom of scope, we will get a overflow stack.

We also reimplment the `Drop` for `Node` to print out "Dropping" if variable is dropping. Notice there is no print out during output. This is because variable `a`, `b`, `c` is increased to 2 after we linked each other. At the end of main scope, variable `a`, `b` and `c` are dropped, the reference count of these 3 variable is decreased to 1 from 2. The heap memory of `Rc<RefCell<Node>>` won't be dropped since the reference count is 1. The instance memory can't be dropped either, because `Rc<RefCell<Node>>` is still refered to it. This is why we can never see "Dropping" in the print output.

## `Weak` pinter to prevent Reference Cycles

To drop an `Rc` instance, we must ensure that its `strong_count` is count to 0. `Weak` pointer can be created by calling `Rc::downgrade`, and it increases the `weak_count` by 1 instead of increasing the `strong_count` by 1.

> Strong references are how you can share ownership of an `Rc<T>` instance. Weak references don’t express an ownership relationship[^2].

We can change above example to `Weak`:

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[derive(Debug)]
struct Node {
    next: Option<Rc<RefCell<Node>>>,
    head: Option<Weak<RefCell<Node>>>,
}

impl Drop for Node {
    fn drop(&mut self) {
        println!("Dropping");
    }
}

fn main() {
    let a = Rc::new(RefCell::new(Node {next: None, head: None}));
    println!("a strong count: {:?}, weak count: {:?}", Rc::strong_count(&a), Rc::weak_count(&a));
    let b = Rc::new(RefCell::new(Node {next: Some(Rc::clone(&a)), head: None}));
    println!("a strong count: {:?}, weak count: {:?}", Rc::strong_count(&a), Rc::weak_count(&a));
    println!("b strong count: {:?}, weak count: {:?}", Rc::strong_count(&b), Rc::weak_count(&b));
    let c = Rc::new(RefCell::new(Node {next: Some(Rc::clone(&b)), head: None}));

    // Creates a reference cycle
    (*a).borrow_mut().head = Some(Rc::downgrade(&c));
    println!("a strong count: {:?}, weak count: {:?}", Rc::strong_count(&a), Rc::weak_count(&a));
    println!("b strong count: {:?}, weak count: {:?}", Rc::strong_count(&b), Rc::weak_count(&b));
    println!("c strong count: {:?}, weak count: {:?}", Rc::strong_count(&c), Rc::weak_count(&c));

    println!("a {:?}",  &a);
}

```

**output:**

```bash
a strong count: 1, weak count: 0
a strong count: 2, weak count: 0
b strong count: 1, weak count: 0
a strong count: 2, weak count: 0
b strong count: 2, weak count: 0
c strong count: 1, weak count: 1
a RefCell { value: Node { next: None, head: Some((Weak)) } }
Dropping
Dropping
Dropping
```

> The `Rc<T>` type uses weak_count to keep track of how many `Weak<T>` references exist, similar to strong_count. **The difference is the weak_count doesn’t need to be 0 for the `Rc<T>` instance to be cleaned up[^2].**

> They won’t cause a reference cycle because any cycle involving some weak references will be broken once the strong reference count of values involved is 0[^2].

Therefore, `Weak` is used for break refernce cycle. A use case for `Weak`: a tree could use `Rc` from parent to children, and `Weak` pointer from children to their parents. By calling upgrade on the Weak pointer, which returns an `Option<Rc<T>>`.

### `Rc` vs `Weak`

- `Rc` strong reference counting. Reference cycle could cause the memory never be deallocated.
- `Weak` weak reference counting that holds a non-owning reference to the allocated memory.

## Reference

[^1]: https://doc.rust-lang.org/std/rc/index.html
[^2]: https://doc.rust-lang.org/book/ch15-06-reference-cycles.html#preventing-reference-cycles-turning-an-rct-into-a-weakt
