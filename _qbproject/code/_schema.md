```scala
// Define your schema 
val issueSchema = qbClass(
    "id" -> objectId,
    "parentIssue" -> optional(objectId), // may be missing in JSON instances
    "status" -> qbEnum("pending", "approved", "rejected"), // enumeration
    "urgence" -> qbInteger(range(1, 5)),    // range constraint on integer
    "reporter" -> qbClass(
        "name" -> qbString(length(1, 100)), 
        "email" -> qbEmail              // convenience type based on string
    ),
    "creationDate" -> qbDateTime // convenience type for dates
)
```
                