# disallow uninitialized class property (proposal/class-property-no-initialized)

This rule allows you to enforce disallow uninitialized class property.

## Rule Details

This rule allows you to enforce disallow uninitialized class property.

## Examples of **incorrect** code for this rule:

```js
class A {
  static foo;
}
```

```js
class A {
  foo;
}
```

## Examples of **correct** code for this rule:

```js
class A {
  static foo = 'Alice';
  bar = undefined;
}
```
