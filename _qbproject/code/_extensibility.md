```scala
// Prepend each string
QBValueUpdate[QBString]().map(schema)(instance) { 
  case JsString(path) => 
    JsString("yay!" + path)
}

// Validate an instance
QBValidator.validate(schema)(instance)
```